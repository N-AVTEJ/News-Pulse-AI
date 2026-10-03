import { describe, it, expect } from 'vitest';
import { evaluateCitations } from '../evaluation/citationEvaluator';
import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';

describe('Citation Evaluator', () => {
  const mockCluster: EventCluster = {
    clusterId: 'cluster_test_2',
    canonicalHeadline: 'Federal Reserve Holds Interest Rates Steady',
    summary: 'The central bank maintained benchmark interest rates following monthly policy meeting.',
    stories: [
      {
        id: 'fed_story_1',
        title: 'Fed holds rates steady in March meeting',
        description: 'Chairman announced the rate target remains between 5.25% and 5.50%.',
        source: 'Bloomberg',
        sourceId: 'src_bloomberg',
        url: 'https://bloomberg.com/fed-rates',
        publishedAt: '2026-03-20T14:00:00Z',
        category: 'BUSINESS',
        topics: ['Economy', 'Rates'],
        isBreaking: false
      }
    ],
    primaryCategory: 'BUSINESS',
    publishers: ['Bloomberg'],
    storyCount: 1,
    publisherCount: 1,
    firstPublished: '2026-03-20T14:00:00Z',
    latestPublished: '2026-03-20T14:00:00Z',
    matchedScouts: ['business-scout'],
    matchedSignals: ['Rates'],
    perScoutScores: { 'business-scout': 85 },
    topSelectionScore: 85,
    selectionReason: 'Key rate update',
    status: 'ACTIVE',
    clusterReason: 'Fed meeting report',
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

  it('validates citations referencing authentic stories with matching quotes', () => {
    const report: AnalysisReport = {
      clusterId: 'cluster_test_2',
      whatHappened: 'Federal reserve held benchmark rates.',
      whyItMatters: 'Economic stability.',
      whoIsAffected: 'Borrowers.',
      whatChanged: 'No rate changes.',
      whatIsUncertain: 'Future inflation path.',
      keyFacts: ['Rates steady'],
      timeline: [],
      entities: [],
      citations: [
        {
          id: 'cite_1',
          statement: 'Target remains between 5.25% and 5.50%',
          sourceName: 'Bloomberg',
          storyId: 'fed_story_1',
          url: 'https://bloomberg.com/fed-rates',
          quote: 'rate target remains between 5.25% and 5.50%'
        }
      ],
      confidenceScore: 95,
      generatedAt: '2026-03-20T14:10:00Z'
    };

    const result = evaluateCitations(mockCluster, report);
    expect(result.score).toBe(100);
    expect(result.status).toBe('VERIFIED');
    expect(result.invalidCitationsCount).toBe(0);
  });

  it('detects hallucinated citations with non-existent story IDs', () => {
    const report: AnalysisReport = {
      clusterId: 'cluster_test_2',
      whatHappened: 'Federal reserve held benchmark rates.',
      whyItMatters: 'Economic stability.',
      whoIsAffected: 'Borrowers.',
      whatChanged: 'No rate changes.',
      whatIsUncertain: 'Future inflation path.',
      keyFacts: ['Rates steady'],
      timeline: [],
      entities: [],
      citations: [
        {
          id: 'cite_fake',
          statement: 'Fabricated claim from imaginary publication',
          sourceName: 'NonExistentNews',
          storyId: 'story_does_not_exist',
          url: 'https://fake.com/story',
          quote: 'imaginary non-existent quote'
        }
      ],
      confidenceScore: 40,
      generatedAt: '2026-03-20T14:10:00Z'
    };

    const result = evaluateCitations(mockCluster, report);
    expect(result.score).toBe(0);
    expect(result.invalidCitationsCount).toBe(1);
    expect(result.status).toBe('SUSPECT');
    expect(result.hallucinatedSourceIds).toContain('story_does_not_exist');
  });
});
