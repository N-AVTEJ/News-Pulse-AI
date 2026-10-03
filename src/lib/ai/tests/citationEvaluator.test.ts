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
        headline: 'Fed holds rates steady in March meeting',
        summary: 'Chairman announced the rate target remains between 5.25% and 5.50%.',
        sourceName: 'Bloomberg',
        sourceUrl: 'https://bloomberg.com',
        articleUrl: 'https://bloomberg.com/fed-rates',
        publishedAt: '2026-03-20T14:00:00Z',
        retrievedAt: '2026-03-20T14:01:00Z',
        category: 'business',
        sourceType: 'rss'
      }
    ],
    primaryCategory: 'business',
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
      executiveSummary: 'Federal reserve held benchmark rates.',
      keyDevelopments: ['Rates held steady'],
      whyItMatters: 'Economic stability.',
      affectedOrganizations: ['Borrowers and banks'],
      potentialImpact: [],
      timelineSummary: 'Decision announced Wednesday.',
      knownFacts: ['Rates steady'],
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
          id: 'cite_1',
          storyId: 'fed_story_1',
          publisherName: 'Bloomberg',
          articleUrl: 'https://bloomberg.com/fed-rates',
          headline: 'Fed holds rates steady in March meeting',
          publishedAt: '2026-03-20T14:00:00Z',
          quoteSnippet: 'rate target remains between 5.25% and 5.50%'
        }
      ],
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
      executiveSummary: 'Federal reserve held benchmark rates.',
      keyDevelopments: ['Rates held steady'],
      whyItMatters: 'Economic stability.',
      affectedOrganizations: ['Borrowers and banks'],
      potentialImpact: [],
      timelineSummary: 'Decision announced Wednesday.',
      knownFacts: ['Rates steady'],
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
          id: 'cite_fake',
          storyId: 'story_does_not_exist',
          publisherName: 'NonExistentNews',
          articleUrl: 'https://fake.com/story',
          headline: 'Fake headline',
          publishedAt: '2026-03-20T14:00:00Z',
          quoteSnippet: 'imaginary non-existent quote'
        }
      ],
      generatedAt: '2026-03-20T14:10:00Z'
    };

    const result = evaluateCitations(mockCluster, report);
    expect(result.score).toBe(0);
    expect(result.invalidCitationsCount).toBe(1);
    expect(result.status).toBe('SUSPECT');
    expect(result.hallucinatedSourceIds).toContain('story_does_not_exist');
  });
});
