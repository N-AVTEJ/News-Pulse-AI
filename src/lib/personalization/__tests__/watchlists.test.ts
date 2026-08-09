import { describe, it, expect } from 'vitest';
import { matchWatchlistRules } from '../watchlists';
import { Watchlist } from '../types';
import { EventCluster } from '../../clustering/types';
import { NewsStory } from '../../news/types';

describe('Custom Watchlists Engine', () => {

  const story1: NewsStory = {
    id: 's1',
    headline: 'OpenAI Launches ChatGPT Search Engine',
    summary: 'Direct competitor to Google search.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/s1',
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
    publishers: ['TechCrunch'],
    storyCount: 1,
    publisherCount: 1,
    firstPublished: new Date().toISOString(),
    latestPublished: new Date().toISOString(),
    matchedScouts: [],
    matchedSignals: [],
    perScoutScores: {},
    topSelectionScore: 80,
    selectionReason: '',
    status: 'ACTIVE',
    clusterReason: '',
    clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
    importanceScore: null,
    verificationScore: null
  };

  const watchlist: Watchlist = {
    id: 'wl1',
    name: 'AI Competition',
    description: 'Track OpenAI & Google',
    rules: {
      keywords: ['search'],
      companies: ['OpenAI', 'Google'],
      products: ['ChatGPT'],
      people: [],
      organizations: [],
      locations: [],
      technologies: [],
      excludeKeywords: ['crypto'],
      priority: 'HIGH'
    },
    createdAt: new Date().toISOString()
  };

  it('matches tracked companies and keywords correctly', () => {
    const res = matchWatchlistRules(cluster, watchlist);
    expect(res.score).toBeGreaterThan(0);
    expect(res.matchedEntities).toContain('OpenAI');
    expect(res.matchedEntities).toContain('ChatGPT');
    expect(res.matchedKeywords).toContain('search');
  });

  it('suppresses match when exclude keyword is present', () => {
    const cryptoStory = { ...story1, summary: 'Crypto payment integration included.' };
    const cryptoCluster = { ...cluster, summary: cryptoStory.summary };

    const res = matchWatchlistRules(cryptoCluster, watchlist);
    expect(res.score).toBe(0);
    expect(res.matchedEntities.length).toBe(0);
  });

});
