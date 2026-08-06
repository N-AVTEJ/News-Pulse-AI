import { describe, it, expect } from 'vitest';
import { evaluateBreakingSignals } from '../breakingDetector';
import { EventCluster } from '../../clustering/types';
import { NewsStory } from '../../news/types';

describe('Breaking Event Detector & Lifecycle Manager', () => {

  const story1: NewsStory = {
    id: 's1',
    headline: 'Major Semiconductor Factory Outage Reported',
    summary: 'Power failure stops production line.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/s1',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  it('assigns BREAKING state when high publisher velocity and primary announcement are detected', () => {
    const cluster: EventCluster = {
      clusterId: 'c1',
      canonicalHeadline: story1.headline,
      summary: story1.summary,
      primaryCategory: 'ai-tech',
      stories: [story1],
      publishers: ['TechCrunch', 'Wired', 'Ars Technica'],
      storyCount: 5,
      publisherCount: 3,
      firstPublished: new Date().toISOString(),
      latestPublished: new Date().toISOString(),
      matchedScouts: [],
      matchedSignals: [],
      perScoutScores: {},
      topSelectionScore: 90,
      selectionReason: '',
      status: 'ACTIVE',
      clusterReason: '',
      clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
      importanceScore: null,
      verificationScore: null,
      verificationResult: {
        clusterId: 'c1',
        verificationStatus: 'STRONG_CORROBORATION',
        supportingSources: ['TechCrunch', 'Wired', 'Ars Technica'],
        independentSources: 3,
        primarySources: [{ ...story1, sourceName: 'TSMC Official Press' }],
        secondarySources: [story1],
        conflictingSources: [],
        evidenceCount: 5,
        verificationReasons: [],
        generatedAt: new Date().toISOString(),
        semanticAgreement: null,
        claimConsistency: null
      }
    };

    const res = evaluateBreakingSignals(cluster);
    expect(res.breakingState).toBe('BREAKING');
    expect(res.isBreaking).toBe(true);
    expect(res.triggers.length).toBeGreaterThan(0);
  });

});
