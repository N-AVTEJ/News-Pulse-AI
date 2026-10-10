import { describe, it, expect, beforeEach } from 'vitest';
import { runAutonomousResearch } from '../researchOrchestrator';
import { researchHistory } from '../researchHistory';
import { EventCluster } from '@/lib/clustering/types';

describe('Phase 14: Research Orchestrator End-to-End', () => {
  const mockClusters: EventCluster[] = [
    {
      clusterId: 'cluster-ai-test',
      canonicalHeadline: 'Breakthrough multi-modal model released by frontier research lab',
      summary: 'A new model achieving high reasoning marks across standard benchmarks was released today.',
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      stories: [
        {
          id: 'story-breakthrough-1',
          sourceId: 'tech-wire',
          sourceName: 'TechWire',
          sourceUrl: 'https://techwire.com',
          articleUrl: 'https://techwire.com/breakthrough-model',
          headline: 'Breakthrough multi-modal model released',
          summary: 'A new model achieving high reasoning marks across standard benchmarks was released today.',
          publishedAt: new Date().toISOString(),
          retrievedAt: new Date().toISOString(),
          category: 'ai-tech'
        }
      ],
      sources: ['TechWire'],
      publishers: ['TechWire'],
      primaryCategory: 'ai-tech',
      velocity: 2.0,
      urgencyScore: 85,
      verificationResult: {
        clusterId: 'cluster-ai-test',
        verificationStatus: 'LIMITED_CORROBORATION',
        corroborationScore: 80,
        sourceDiversityScore: 50,
        evidenceQualityScore: 85,
        publicationConsistencyScore: 90,
        corroboratingSourcesCount: 1,
        primarySourceCount: 1,
        evidenceCount: 1,
        conflictDetected: false,
        evaluatedAt: new Date().toISOString()
      }
    }
  ];

  beforeEach(() => {
    researchHistory.clear();
  });

  it('should enforce RBAC and reject unauthorized roles', async () => {
    await expect(
      runAutonomousResearch({
        question: 'What are the safety benchmarks for the new multi-modal model?',
        userRole: 'VIEWER' // Lacks EDIT_INVESTIGATIONS
      })
    ).rejects.toThrow(/Unauthorized/);
  });

  it('should execute complete autonomous research pipeline for authorized analyst', async () => {
    const run = await runAutonomousResearch({
      question: 'What are the reasoning benchmarks and safety metrics of the breakthrough model?',
      userRole: 'ANALYST',
      clusters: mockClusters,
      maxConcurrency: 2,
      timeoutMs: 4000
    });

    expect(run).toBeDefined();
    expect(run.status).toBe('COMPLETED');
    expect(run.tasks.length).toBeGreaterThanOrEqual(2);
    expect(run.findings.length).toBeGreaterThan(0);
    expect(run.report).toBeDefined();

    // Check report structure
    const report = run.report!;
    expect(report.executiveSummary).toBeTruthy();
    expect(report.keyFindings.length).toBeGreaterThan(0);
    expect(report.allCitations.length).toBeGreaterThan(0);
    expect(report.qualityGateResult).toBeDefined();

    // Verify run is stored in research history
    const stored = researchHistory.getRun(run.id);
    expect(stored).toBeDefined();
    expect(stored?.id).toBe(run.id);
    expect(stored?.status).toBe('COMPLETED');
  });

  it('should support early cancellation if requested', async () => {
    const run = await runAutonomousResearch({
      question: 'Will this question execution be safely cancelled?',
      userRole: 'RESEARCHER',
      clusters: mockClusters,
      isCancelled: () => true
    });

    expect(run.status).toBe('CANCELLED');
    expect(run.cancelRequested || run.status === 'CANCELLED').toBe(true);
  });
});
