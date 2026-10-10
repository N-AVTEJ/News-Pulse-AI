import { describe, it, expect } from 'vitest';
import { executeResearchTasks } from '../researchExecutor';
import { ResearchTask } from '../types';
import { EventCluster } from '@/lib/clustering/types';

describe('Phase 14: Research Executor', () => {
  const sampleClusters: EventCluster[] = [
    {
      clusterId: 'c1',
      canonicalHeadline: 'Quantum computing lab achieves 1000 qubit benchmark',
      summary: 'Researchers set a major benchmark in quantum state coherence.',
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      stories: [
        {
          id: 's1',
          sourceId: 'tech',
          sourceName: 'TechJournal',
          sourceUrl: 'https://techjournal.com',
          articleUrl: 'https://techjournal.com/quantum-benchmark',
          headline: 'Quantum computing lab achieves 1000 qubit benchmark',
          summary: 'Researchers set a major benchmark in quantum state coherence.',
          publishedAt: new Date().toISOString(),
          retrievedAt: new Date().toISOString(),
          category: 'ai-tech'
        }
      ],
      sources: ['TechJournal'],
      publishers: ['TechJournal'],
      primaryCategory: 'ai-tech',
      velocity: 1.0,
      urgencyScore: 70
    }
  ];

  it('should execute tasks concurrently within bounded limits and produce findings', async () => {
    const tasks: ResearchTask[] = [
      {
        id: 'task-1',
        question: 'What are the recent milestones in quantum computing qubit counts?',
        topic: 'Technology',
        targetEntities: [],
        requiredEvidenceType: 'PRIMARY_SOURCE',
        status: 'PENDING',
        resultReferences: [],
        findingsCount: 0
      },
      {
        id: 'task-2',
        question: 'How do researchers maintain quantum state coherence?',
        topic: 'Technology',
        targetEntities: [],
        requiredEvidenceType: 'CORROBORATED_REPORT',
        status: 'PENDING',
        resultReferences: [],
        findingsCount: 0
      }
    ];

    const result = await executeResearchTasks(tasks, sampleClusters, { maxConcurrency: 2, timeoutMs: 3000 });

    expect(result.cancelled).toBe(false);
    expect(result.tasks.every(t => t.status === 'COMPLETED')).toBe(true);
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.citations.length).toBeGreaterThan(0);
  });

  it('should halt execution immediately if cancellation is signaled', async () => {
    const tasks: ResearchTask[] = [
      {
        id: 't-cancel-1',
        question: 'Question 1',
        topic: 'General',
        targetEntities: [],
        requiredEvidenceType: 'CORROBORATED_REPORT',
        status: 'PENDING',
        resultReferences: [],
        findingsCount: 0
      },
      {
        id: 't-cancel-2',
        question: 'Question 2',
        topic: 'General',
        targetEntities: [],
        requiredEvidenceType: 'CORROBORATED_REPORT',
        status: 'PENDING',
        resultReferences: [],
        findingsCount: 0
      }
    ];

    const result = await executeResearchTasks(tasks, sampleClusters, {
      maxConcurrency: 1,
      isCancelled: () => true
    });

    expect(result.cancelled).toBe(true);
  });
});
