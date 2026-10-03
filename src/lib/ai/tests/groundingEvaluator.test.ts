import { describe, it, expect } from 'vitest';
import { evaluateGrounding } from '../evaluation/groundingEvaluator';
import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';

describe('Grounding Evaluator', () => {
  const mockCluster: EventCluster = {
    clusterId: 'cluster_test_1',
    canonicalHeadline: 'Nvidia Unveils Next-Gen Blackwell Architecture for AI Datacenters',
    summary: 'Nvidia announced new GPU systems designed to accelerate large scale neural networks.',
    stories: [
      {
        id: 'story_1',
        headline: 'Nvidia Blackwell GPUs announced at GTC',
        summary: 'CEO Jensen Huang introduced new high performance datacenter hardware. Blackwell architecture delivers significant performance improvements for inference.',
        sourceName: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com',
        articleUrl: 'https://techcrunch.com/nvidia-blackwell',
        publishedAt: '2026-03-18T10:00:00Z',
        retrievedAt: '2026-03-18T10:01:00Z',
        category: 'ai-tech',
        sourceType: 'rss'
      }
    ],
    primaryCategory: 'ai-tech',
    publishers: ['TechCrunch'],
    storyCount: 1,
    publisherCount: 1,
    firstPublished: '2026-03-18T10:00:00Z',
    latestPublished: '2026-03-18T10:00:00Z',
    matchedScouts: ['tech-scout'],
    matchedSignals: ['GPU', 'Hardware'],
    perScoutScores: { 'tech-scout': 90 },
    topSelectionScore: 90,
    selectionReason: 'Key hardware announcement',
    status: 'ACTIVE',
    clusterReason: 'Single hardware report',
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

  it('awards HIGH score to report grounded strictly in cluster evidence', () => {
    const report: AnalysisReport = {
      clusterId: 'cluster_test_1',
      executiveSummary: 'Nvidia announced new Blackwell architecture GPUs designed for AI datacenter hardware at GTC.',
      keyDevelopments: ['Blackwell GPUs unveiled at GTC'],
      whyItMatters: 'It delivers significant performance improvements for large scale neural network inference.',
      affectedOrganizations: ['Datacenter operators and enterprise AI developers'],
      potentialImpact: [],
      timelineSummary: 'Announced today during GTC keynote.',
      knownFacts: ['Nvidia introduced Blackwell GPUs', 'Performance gains for inference workloads'],
      remainingUncertainty: [],
      citations: [],
      entities: [
        { id: 'e1', name: 'Nvidia', category: 'COMPANY', mentionCount: 3, sourceArticles: ['story_1'] },
        { id: 'e2', name: 'Blackwell', category: 'PRODUCT', mentionCount: 2, sourceArticles: ['story_1'] }
      ],
      entityRelationships: [],
      relatedEvents: [],
      provider: 'test-model',
      generatedAt: '2026-03-18T10:05:00Z',
      durationMs: 300,
      validationPassed: true,
      validationNotes: []
    };

    const score = evaluateGrounding(mockCluster, report);
    expect(score.score).toBeGreaterThan(60);
    expect(score.status).toBe('HIGH');
    expect(score.entityGroundingRatio).toBe(1.0);
  });

  it('penalizes hallucinated reports mentioning ungrounded entities', () => {
    const hallucinatedReport: AnalysisReport = {
      clusterId: 'cluster_test_1',
      executiveSummary: 'Unrelated aerospace manufacturer launched satellite constellation into orbit with rocket.',
      keyDevelopments: ['Satellite launch success'],
      whyItMatters: 'Maritime communication connectivity improved across polar regions.',
      affectedOrganizations: ['Satellite operators and space agencies'],
      potentialImpact: [],
      timelineSummary: 'Launch took place this morning.',
      knownFacts: ['Satellite launch success'],
      remainingUncertainty: [],
      citations: [],
      entities: [
        { id: 'e_fake', name: 'SpaceX', category: 'COMPANY', mentionCount: 1, sourceArticles: ['story_fake'] }
      ],
      entityRelationships: [],
      relatedEvents: [],
      provider: 'test-model',
      generatedAt: '2026-03-18T10:05:00Z',
      durationMs: 300,
      validationPassed: true,
      validationNotes: []
    };

    const score = evaluateGrounding(mockCluster, hallucinatedReport);
    expect(score.score).toBeLessThan(55);
    expect(score.status).toBe('POOR');
    expect(score.entityGroundingRatio).toBe(0);
  });
});
