import { describe, it, expect } from 'vitest';
import { evaluateGrounding } from '../evaluation/groundingEvaluator';
import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';

describe('Grounding Evaluator', () => {
  const mockCluster: EventCluster = {
    clusterId: 'cluster_test_1',
    canonicalHeadline: 'Nvidia Unveils Next-Gen Blackwell Architecture for AI Datacenters',
    summary: 'Nvidia announced new GPU systems designed to accelerate large scale neural networks.',
    articles: [
      {
        id: 'story_1',
        title: 'Nvidia Blackwell GPUs announced at GTC',
        description: 'CEO Jensen Huang introduced new high performance datacenter hardware.',
        contentSnippet: 'Blackwell architecture delivers significant performance improvements for inference.',
        source: 'TechCrunch',
        sourceId: 'src_tc',
        url: 'https://techcrunch.com/nvidia-blackwell',
        publishedAt: '2026-03-18T10:00:00Z',
        category: 'TECHNOLOGY',
        topics: ['AI', 'Hardware'],
        isBreaking: false
      }
    ],
    primaryCategory: 'TECHNOLOGY',
    publishers: ['TechCrunch'],
    firstSeenAt: '2026-03-18T10:00:00Z',
    lastUpdatedAt: '2026-03-18T10:00:00Z',
    storyCount: 1,
    geographicScope: 'GLOBAL',
    temporalRange: { start: '2026-03-18T10:00:00Z', end: '2026-03-18T10:00:00Z' }
  };

  it('awards HIGH score to report grounded strictly in cluster evidence', () => {
    const report: AnalysisReport = {
      clusterId: 'cluster_test_1',
      whatHappened: 'Nvidia announced new Blackwell architecture GPUs designed for AI datacenter hardware at GTC.',
      whyItMatters: 'It delivers significant performance improvements for large scale neural network inference.',
      whoIsAffected: 'Datacenter operators and enterprise AI developers.',
      whatChanged: 'Performance benchmarks increased over previous generation chips.',
      whatIsUncertain: 'Commercial delivery timeline and individual system pricing.',
      keyFacts: ['Nvidia introduced Blackwell GPUs', 'Performance gains for inference workloads'],
      timeline: [],
      entities: [
        { name: 'Nvidia', type: 'COMPANY', mentions: 3, role: 'Chipmaker announcing hardware' },
        { name: 'Blackwell', type: 'PRODUCT', mentions: 2, role: 'GPU architecture' }
      ],
      citations: [],
      confidenceScore: 90,
      generatedAt: '2026-03-18T10:05:00Z'
    };

    const score = evaluateGrounding(mockCluster, report);
    expect(score.score).toBeGreaterThan(60);
    expect(score.status).toBe('HIGH');
    expect(score.entityGroundingRatio).toBe(1.0);
  });

  it('penalizes hallucinated reports mentioning ungrounded entities', () => {
    const hallucinatedReport: AnalysisReport = {
      clusterId: 'cluster_test_1',
      whatHappened: 'Unrelated aerospace manufacturer launched satellite constellation into orbit with rocket.',
      whyItMatters: 'Maritime communication connectivity improved across polar regions.',
      whoIsAffected: 'Satellite operators and space agencies.',
      whatChanged: 'Orbital coverage expanded.',
      whatIsUncertain: 'Weather conditions for next launch.',
      keyFacts: ['Satellite launch success'],
      timeline: [],
      entities: [
        { name: 'SpaceX', type: 'COMPANY', mentions: 1, role: 'Launcher' }
      ],
      citations: [],
      confidenceScore: 30,
      generatedAt: '2026-03-18T10:05:00Z'
    };

    const score = evaluateGrounding(mockCluster, hallucinatedReport);
    expect(score.score).toBeLessThan(55);
    expect(score.status).toBe('POOR');
    expect(score.entityGroundingRatio).toBe(0);
  });
});
