import { resolveEntity } from '@/lib/knowledge/entityResolver';
import { ResearchTask, RequiredEvidenceType } from './types';

export interface PlanValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates the structure and integrity of a decomposed research task plan.
 */
export function validateResearchTaskPlan(tasks: ResearchTask[]): PlanValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(tasks) || tasks.length === 0) {
    errors.push('Task plan must contain at least one research task.');
    return { valid: false, errors };
  }

  const ids = new Set<string>();

  tasks.forEach((task, index) => {
    if (!task.id || task.id.trim() === '') {
      errors.push(`Task at index ${index} missing valid task ID.`);
    } else if (ids.has(task.id)) {
      errors.push(`Duplicate task ID '${task.id}' found.`);
    } else {
      ids.add(task.id);
    }

    if (!task.question || task.question.trim().length < 8) {
      errors.push(`Task '${task.id || index}' must possess a clear research question (min 8 chars).`);
    }

    if (!task.topic || task.topic.trim() === '') {
      errors.push(`Task '${task.id || index}' missing topic classification.`);
    }

    const validEvidenceTypes: RequiredEvidenceType[] = [
      'CORROBORATED_REPORT',
      'PRIMARY_SOURCE',
      'FINANCIAL_DISCLOSURE',
      'REGULATORY_FILING',
      'GENERAL_EVIDENCE'
    ];

    if (!validEvidenceTypes.includes(task.requiredEvidenceType)) {
      errors.push(`Task '${task.id || index}' has invalid requiredEvidenceType: ${task.requiredEvidenceType}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Decomposes a user intelligence question into a validated plan of 2 to 4 structured research tasks.
 * Avoids fabricating facts by ensuring tasks are investigative queries with entity extractions.
 */
export function planResearchQuestion(rawQuestion: string): ResearchTask[] {
  const q = (rawQuestion || '').trim();
  if (q.length < 5) {
    throw new Error('Research question must be at least 5 characters long.');
  }

  const qLower = q.toLowerCase();

  // Detect relevant entities using entity resolution
  const knownTokens = [
    'openai', 'google', 'nvidia', 'microsoft', 'apple', 'tsmc', 'amazon', 'meta',
    'anthropic', 'intel', 'amd', 'federal reserve', 'sec', 'doj', 'eu', 'china'
  ];

  const targetEntities: string[] = [];
  for (const token of knownTokens) {
    if (qLower.includes(token)) {
      const resolved = resolveEntity(token);
      if (!targetEntities.includes(resolved.canonicalName)) {
        targetEntities.push(resolved.canonicalName);
      }
    }
  }

  // Extract explicit dates or year mentions if present
  let dateRange: { start: string; end: string } | undefined;
  const yearMatch = q.match(/\b(202[4-6])\b/);
  if (yearMatch) {
    const year = yearMatch[1];
    dateRange = {
      start: `${year}-01-01T00:00:00Z`,
      end: `${year}-12-31T23:59:59Z`
    };
  }

  // Determine domain classification
  let primaryTopic = 'General Intelligence';
  let evidenceType: RequiredEvidenceType = 'CORROBORATED_REPORT';

  if (qLower.includes('antitrust') || qLower.includes('regulation') || qLower.includes('policy') || qLower.includes('court') || qLower.includes('ban')) {
    primaryTopic = 'Regulatory & Legal Strategy';
    evidenceType = 'REGULATORY_FILING';
  } else if (qLower.includes('earnings') || qLower.includes('market') || qLower.includes('stock') || qLower.includes('revenue') || qLower.includes('acquisition') || qLower.includes('merger')) {
    primaryTopic = 'Financial & Corporate Activity';
    evidenceType = 'FINANCIAL_DISCLOSURE';
  } else if (qLower.includes('ai') || qLower.includes('chip') || qLower.includes('model') || qLower.includes('gpu') || qLower.includes('quantum') || qLower.includes('hardware')) {
    primaryTopic = 'Technology Architecture & Breakthroughs';
    evidenceType = 'PRIMARY_SOURCE';
  }

  const baseId = `task_${Date.now()}`;

  const tasks: ResearchTask[] = [
    {
      id: `${baseId}_core`,
      question: `What are the primary documented developments and facts regarding "${q}"?`,
      topic: `${primaryTopic} - Direct Evidence`,
      targetEntities,
      dateRange,
      requiredEvidenceType: evidenceType,
      status: 'PENDING',
      resultReferences: [],
      findingsCount: 0
    },
    {
      id: `${baseId}_entities`,
      question: `How are key entities and institutions (${targetEntities.length > 0 ? targetEntities.join(', ') : 'key stakeholders'}) involved or affected?`,
      topic: `${primaryTopic} - Entity Ecosystem`,
      targetEntities,
      dateRange,
      requiredEvidenceType: 'CORROBORATED_REPORT',
      status: 'PENDING',
      resultReferences: [],
      findingsCount: 0
    },
    {
      id: `${baseId}_implications`,
      question: `What are the potential strategic, economic, or regulatory consequences and unresolved uncertainties?`,
      topic: `${primaryTopic} - Impact & Uncertainties`,
      targetEntities,
      dateRange,
      requiredEvidenceType: 'GENERAL_EVIDENCE',
      status: 'PENDING',
      resultReferences: [],
      findingsCount: 0
    }
  ];

  // Validate the generated plan before returning
  const validation = validateResearchTaskPlan(tasks);
  if (!validation.valid) {
    throw new Error(`Failed to generate valid research plan: ${validation.errors.join('; ')}`);
  }

  return tasks;
}
