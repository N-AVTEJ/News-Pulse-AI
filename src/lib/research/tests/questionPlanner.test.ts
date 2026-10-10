import { describe, it, expect } from 'vitest';
import { planResearchQuestion, validateResearchTaskPlan } from '../questionPlanner';

describe('Phase 14: Question Planner', () => {
  it('should decompose an AI technology question into structured research tasks with target entities', () => {
    const question = 'What are OpenAI and Nvidia doing regarding AI chip development and clusters?';
    const tasks = planResearchQuestion(question);

    expect(tasks.length).toBeGreaterThanOrEqual(2);
    expect(tasks.length).toBeLessThanOrEqual(4);

    // Verify entity resolution detected OpenAI and NVIDIA
    const hasNvidiaOrOpenAI = tasks.some(t => 
      t.targetEntities.includes('OpenAI') || t.targetEntities.includes('NVIDIA')
    );
    expect(hasNvidiaOrOpenAI).toBe(true);

    // Primary topic should classify into technology
    expect(tasks[0].topic).toContain('Technology');
    expect(tasks[0].requiredEvidenceType).toBe('PRIMARY_SOURCE');
  });

  it('should decompose a regulatory query into regulatory evidence tasks', () => {
    const question = 'What antitrust regulations or court rulings affect tech giants in 2025?';
    const tasks = planResearchQuestion(question);

    expect(tasks.length).toBeGreaterThanOrEqual(2);
    expect(tasks[0].topic).toContain('Regulatory');
    expect(tasks[0].requiredEvidenceType).toBe('REGULATORY_FILING');
    expect(tasks[0].dateRange).toBeDefined();
    expect(tasks[0].dateRange?.start).toContain('2025');
  });

  it('should validate valid task plans successfully', () => {
    const tasks = planResearchQuestion('How will clean energy adoption impact semiconductor manufacturing?');
    const validation = validateResearchTaskPlan(tasks);

    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should reject invalid or malformed task plans', () => {
    // Empty array
    const emptyValidation = validateResearchTaskPlan([]);
    expect(emptyValidation.valid).toBe(false);
    expect(emptyValidation.errors[0]).toContain('at least one');

    // Duplicate IDs or invalid questions
    const invalidTasks = [
      {
        id: 'dup_id',
        question: 'short',
        topic: '',
        targetEntities: [],
        requiredEvidenceType: 'CORROBORATED_REPORT' as const,
        status: 'PENDING' as const,
        resultReferences: [],
        findingsCount: 0
      },
      {
        id: 'dup_id',
        question: 'What is the second valid task question here?',
        topic: 'Technology',
        targetEntities: [],
        requiredEvidenceType: 'CORROBORATED_REPORT' as const,
        status: 'PENDING' as const,
        resultReferences: [],
        findingsCount: 0
      }
    ];

    const invalidValidation = validateResearchTaskPlan(invalidTasks);
    expect(invalidValidation.valid).toBe(false);
    expect(invalidValidation.errors.some(e => e.includes('Duplicate'))).toBe(true);
    expect(invalidValidation.errors.some(e => e.includes('min 8 chars'))).toBe(true);
  });

  it('should reject raw questions that are too short', () => {
    expect(() => planResearchQuestion('what')).toThrow('at least 5 characters');
  });
});
