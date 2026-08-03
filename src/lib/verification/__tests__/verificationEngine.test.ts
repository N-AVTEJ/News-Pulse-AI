import { describe, it, expect } from 'vitest';
import { evaluateVerificationRules } from '../rules';
import { EventCluster } from '../../clustering/types';
import { NewsStory } from '../../news/types';

describe('Verification Engine Rules', () => {

  const baseStory: NewsStory = {
    id: 's1',
    headline: 'Major Semiconductor Breakthrough Unveiled',
    summary: 'New chip design unveiled today.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/s1',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  it('assigns INSUFFICIENT_EVIDENCE to single publisher report without primary evidence', () => {
    const cluster: EventCluster = {
      clusterId: 'c1',
      canonicalHeadline: baseStory.headline,
      summary: baseStory.summary,
      primaryCategory: 'ai-tech',
      stories: [baseStory],
      publishers: ['TechCrunch'],
      storyCount: 1,
      publisherCount: 1,
      firstPublished: baseStory.publishedAt,
      latestPublished: baseStory.publishedAt,
      matchedScouts: [],
      matchedSignals: [],
      perScoutScores: {},
      topSelectionScore: 0,
      selectionReason: '',
      status: 'ACTIVE',
      clusterReason: '',
      clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
      importanceScore: null,
      verificationScore: null
    };

    const res = evaluateVerificationRules(cluster);
    expect(res.verificationStatus).toBe('INSUFFICIENT_EVIDENCE');
    expect(res.independentSources).toBe(1);
  });

  it('assigns STRONG_CORROBORATION when 3+ independent publishers report the event', () => {
    const story2 = { ...baseStory, id: 's2', sourceName: 'Wired', articleUrl: 'https://wired.com/s2' };
    const story3 = { ...baseStory, id: 's3', sourceName: 'Ars Technica', articleUrl: 'https://arstechnica.com/s3' };

    const cluster: EventCluster = {
      clusterId: 'c2',
      canonicalHeadline: baseStory.headline,
      summary: baseStory.summary,
      primaryCategory: 'ai-tech',
      stories: [baseStory, story2, story3],
      publishers: ['TechCrunch', 'Wired', 'Ars Technica'],
      storyCount: 3,
      publisherCount: 3,
      firstPublished: baseStory.publishedAt,
      latestPublished: baseStory.publishedAt,
      matchedScouts: [],
      matchedSignals: [],
      perScoutScores: {},
      topSelectionScore: 0,
      selectionReason: '',
      status: 'ACTIVE',
      clusterReason: '',
      clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
      importanceScore: null,
      verificationScore: null
    };

    const res = evaluateVerificationRules(cluster);
    expect(res.verificationStatus).toBe('STRONG_CORROBORATION');
    expect(res.independentSources).toBe(3);
  });

  it('counts multiple articles from the SAME publisher as 1 single independent publisher', () => {
    const story2SamePub = { ...baseStory, id: 's2', articleUrl: 'https://techcrunch.com/s2-followup' };
    const story3SamePub = { ...baseStory, id: 's3', articleUrl: 'https://techcrunch.com/s3-analysis' };

    const cluster: EventCluster = {
      clusterId: 'c3',
      canonicalHeadline: baseStory.headline,
      summary: baseStory.summary,
      primaryCategory: 'ai-tech',
      stories: [baseStory, story2SamePub, story3SamePub],
      publishers: ['TechCrunch'],
      storyCount: 3,
      publisherCount: 1,
      firstPublished: baseStory.publishedAt,
      latestPublished: baseStory.publishedAt,
      matchedScouts: [],
      matchedSignals: [],
      perScoutScores: {},
      topSelectionScore: 0,
      selectionReason: '',
      status: 'ACTIVE',
      clusterReason: '',
      clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
      importanceScore: null,
      verificationScore: null
    };

    const res = evaluateVerificationRules(cluster);
    expect(res.independentSources).toBe(1);
    expect(res.verificationStatus).toBe('INSUFFICIENT_EVIDENCE');
  });

});
