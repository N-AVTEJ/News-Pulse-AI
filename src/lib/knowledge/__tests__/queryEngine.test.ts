import { describe, it, expect } from 'vitest';
import { parseNaturalLanguageQuery } from '../queryEngine';
import { EventCluster } from '../../clustering/types';

describe('Natural Language Query Engine', () => {

  const sampleClusters: EventCluster[] = [
    {
      clusterId: 'c1',
      canonicalHeadline: 'OpenAI Releases ChatGPT Search Feature',
      summary: 'OpenAI announces search product.',
      primaryCategory: 'ai-tech',
      stories: [],
      publishers: ['Ars Technica'],
      storyCount: 1,
      publisherCount: 1,
      firstPublished: new Date().toISOString(),
      latestPublished: new Date().toISOString(),
      matchedScouts: [],
      matchedSignals: [],
      perScoutScores: {},
      topSelectionScore: 80,
      selectionReason: 'AI',
      status: 'ACTIVE',
      clusterReason: 'Reason',
      clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
      importanceScore: null,
      verificationScore: null,
      verificationResult: {
        clusterId: 'c1',
        verificationStatus: 'STRONG_CORROBORATION',
        corroborationScore: 85,
        sourceDiversityScore: 90,
        evidenceQualityScore: 80,
        temporalConsistencyScore: 85,
        independentSources: 3,
        primaryPublisherFound: true,
        verificationReason: 'Verified',
        generatedAt: new Date().toISOString()
      }
    }
  ];

  it('translates entity and verification queries into structured filters', () => {
    const result = parseNaturalLanguageQuery('Show verified OpenAI events', sampleClusters);
    expect(result.filter.entity).toBe('OpenAI');
    expect(result.filter.verificationStatus).toBe('STRONG_CORROBORATION');
    expect(result.matchedClusterIds).toContain('c1');
  });

});
