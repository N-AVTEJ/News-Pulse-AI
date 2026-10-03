import { describe, it, expect } from 'vitest';
import { evaluateReportQualityGate } from '../evaluation/qualityGate';
import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';

describe('AI Report Quality Gate', () => {
  const mockCluster: EventCluster = {
    clusterId: 'cluster_gate_1',
    canonicalHeadline: 'Quantum Computing Lab Achieves 1000 Logical Qubits Milestone',
    summary: 'Researchers demonstrate fault-tolerant quantum error correction in cryogenic laboratory.',
    stories: [
      {
        id: 'qc_story_1',
        headline: 'Quantum computing milestone reached',
        summary: 'Researchers demonstrate fault-tolerant quantum error correction in laboratory trials.',
        sourceName: 'Nature News',
        sourceUrl: 'https://nature.com',
        articleUrl: 'https://nature.com/quantum',
        publishedAt: '2026-04-01T12:00:00Z',
        retrievedAt: '2026-04-01T12:01:00Z',
        category: 'ai-tech',
        sourceType: 'rss'
      }
    ],
    primaryCategory: 'ai-tech',
    publishers: ['Nature News'],
    storyCount: 1,
    publisherCount: 1,
    firstPublished: '2026-04-01T12:00:00Z',
    latestPublished: '2026-04-01T12:00:00Z',
    matchedScouts: ['tech-scout'],
    matchedSignals: ['Quantum'],
    perScoutScores: { 'tech-scout': 95 },
    topSelectionScore: 95,
    selectionReason: 'Milestone science breakthrough',
    status: 'ACTIVE',
    clusterReason: 'Single report on qubit record',
    clusterBreakdown: {
      headlineSimilarity: 40,
      entityOverlap: 30,
      timeProximity: 20,
      categoryMatch: 10,
      totalScore: 100
    },
    importanceScore: null,
    verificationScore: null
  };

  it('approves publication for highly grounded, citation-verified report', () => {
    const validReport: AnalysisReport = {
      clusterId: 'cluster_gate_1',
      executiveSummary: 'Researchers demonstrated fault-tolerant quantum error correction in laboratory trials.',
      keyDevelopments: ['1000 logical qubits achieved', 'Demonstrated quantum error correction'],
      whyItMatters: 'Progress toward practical quantum computers.',
      affectedOrganizations: ['Cryptographers and physicists'],
      potentialImpact: [],
      timelineSummary: 'Milestone published this morning.',
      knownFacts: ['1000 logical qubits achieved', 'Demonstrated quantum error correction'],
      remainingUncertainty: [],
      entities: [
        { id: 'e1', name: 'Nature News', category: 'ORGANIZATION', mentionCount: 1, sourceArticles: ['qc_story_1'] }
      ],
      entityRelationships: [],
      relatedEvents: [],
      provider: 'test-model',
      durationMs: 300,
      validationPassed: true,
      validationNotes: [],
      citations: [
        {
          id: 'cite_1',
          storyId: 'qc_story_1',
          publisherName: 'Nature News',
          articleUrl: 'https://nature.com/quantum',
          headline: 'Quantum computing milestone reached',
          publishedAt: '2026-04-01T12:00:00Z',
          quoteSnippet: 'quantum error correction'
        }
      ],
      generatedAt: '2026-04-01T12:10:00Z'
    };

    const gate = evaluateReportQualityGate(mockCluster, validReport);
    expect(gate.passed).toBe(true);
    expect(gate.decision).toBe('PUBLISH');
    expect(gate.overallScore).toBeGreaterThanOrEqual(70);
  });

  it('rejects publication when hallucinated citations and ungrounded statements are found', () => {
    const invalidReport: AnalysisReport = {
      clusterId: 'cluster_gate_1',
      executiveSummary: 'Automotive company recalled electric vehicles due to brake failure.',
      keyDevelopments: ['Car recall announced'],
      whyItMatters: 'Safety issue on highways.',
      affectedOrganizations: ['Drivers in Europe'],
      potentialImpact: [],
      timelineSummary: 'Recall announced yesterday.',
      knownFacts: ['Car recall announced'],
      remainingUncertainty: [],
      entities: [],
      entityRelationships: [],
      relatedEvents: [],
      provider: 'test-model',
      durationMs: 300,
      validationPassed: true,
      validationNotes: [],
      citations: [
        {
          id: 'cite_bad',
          storyId: 'story_ghost_id',
          publisherName: 'FakeAuto',
          articleUrl: 'https://fake.com',
          headline: 'Car recall announced',
          publishedAt: '2026-04-01T12:00:00Z',
          quoteSnippet: 'fake cars'
        }
      ],
      generatedAt: '2026-04-01T12:10:00Z'
    };

    const gate = evaluateReportQualityGate(mockCluster, invalidReport);
    expect(gate.passed).toBe(false);
    expect(gate.decision).toBe('REJECT');
    expect(gate.overallScore).toBeLessThan(50);
    expect(gate.reasons.length).toBeGreaterThan(0);
  });
});
