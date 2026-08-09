import { describe, it, expect } from 'vitest';
import { calculateRelevanceScore } from '../ranking';
import { getActiveWorkspace, getUserProfile } from '../profile';
import { EventCluster } from '../../clustering/types';
import { NewsStory } from '../../news/types';

describe('Explainable Relevance Ranking Engine', () => {

  const story1: NewsStory = {
    id: 's1',
    headline: 'Nvidia Unveils Next-Gen Blackwell Ultra GPUs',
    summary: 'New datacenter hardware for frontier AI.',
    sourceName: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    articleUrl: 'https://arstechnica.com/s1',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  const cluster: EventCluster = {
    clusterId: 'c1',
    canonicalHeadline: story1.headline,
    summary: story1.summary,
    primaryCategory: 'ai-tech',
    stories: [story1],
    publishers: ['Ars Technica'],
    storyCount: 1,
    publisherCount: 1,
    firstPublished: new Date().toISOString(),
    latestPublished: new Date().toISOString(),
    matchedScouts: [],
    matchedSignals: [],
    perScoutScores: {},
    topSelectionScore: 85,
    selectionReason: '',
    status: 'ACTIVE',
    clusterReason: '',
    clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
    importanceScore: null,
    verificationScore: null
  };

  it('computes score and provides transparent matchReasons', () => {
    const profile = getUserProfile();
    const workspace = getActiveWorkspace();

    const res = calculateRelevanceScore(cluster, profile, workspace);
    expect(res.relevanceScore).toBeGreaterThan(0);
    expect(res.matchReasons.length).toBeGreaterThan(0);
    expect(res.matchReasons.some(r => r.includes('Preferred Category'))).toBe(true);
  });

});
