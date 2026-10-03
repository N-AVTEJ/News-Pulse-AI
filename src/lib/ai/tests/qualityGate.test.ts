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
        title: 'Quantum computing milestone reached',
        description: 'Researchers demonstrate fault-tolerant quantum error correction.',
        contentSnippet: 'The 1000 qubit benchmark was verified in laboratory trials.',
        source: 'Nature News',
        sourceId: 'src_nature',
        url: 'https://nature.com/quantum',
        publishedAt: '2026-04-01T12:00:00Z',
        category: 'TECHNOLOGY',
        topics: ['Quantum', 'Physics'],
        isBreaking: true
      }
    ],
    primaryCategory: 'TECHNOLOGY',
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
      whatHappened: 'Researchers demonstrated fault-tolerant quantum error correction in laboratory trials.',
      whyItMatters: 'Progress toward practical quantum computers.',
      whoIsAffected: 'Cryptographers and physicists.',
      whatChanged: 'Logical qubit threshold increased.',
      whatIsUncertain: 'Scalability outside laboratory conditions.',
      keyFacts: ['1000 logical qubits achieved', 'Demonstrated quantum error correction'],
      timeline: [],
      entities: [
        { name: 'Nature News', type: 'ORGANIZATION', mentions: 1, role: 'Reporting publisher' }
      ],
      citations: [
        {
          id: 'cite_1',
          statement: 'Quantum error correction demonstrated',
          sourceName: 'Nature News',
          storyId: 'qc_story_1',
          url: 'https://nature.com/quantum',
          quote: 'quantum error correction'
        }
      ],
      confidenceScore: 92,
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
      whatHappened: 'Automotive company recalled electric vehicles due to brake failure.',
      whyItMatters: 'Safety issue on highways.',
      whoIsAffected: 'Drivers in Europe.',
      whatChanged: 'Production halted.',
      whatIsUncertain: 'Repair cost.',
      keyFacts: ['Car recall announced'],
      timeline: [],
      entities: [],
      citations: [
        {
          id: 'cite_bad',
          statement: 'Recall announced',
          sourceName: 'FakeAuto',
          storyId: 'story_ghost_id',
          url: 'https://fake.com',
          quote: 'fake cars'
        }
      ],
      confidenceScore: 20,
      generatedAt: '2026-04-01T12:10:00Z'
    };

    const gate = evaluateReportQualityGate(mockCluster, invalidReport);
    expect(gate.passed).toBe(false);
    expect(gate.decision).toBe('REJECT');
    expect(gate.overallScore).toBeLessThan(50);
    expect(gate.reasons.length).toBeGreaterThan(0);
  });
});
