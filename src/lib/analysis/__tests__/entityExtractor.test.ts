import { describe, it, expect } from 'vitest';
import { extractEntitiesFromCluster, extractEntityRelationships } from '../entityExtractor';
import { EventCluster } from '../../clustering/types';
import { NewsStory } from '../../news/types';

describe('Entity Extractor & Relationship Graph', () => {

  const story: NewsStory = {
    id: 's1',
    headline: 'Microsoft and OpenAI Unveil New ChatGPT Integration',
    summary: 'Satya Nadella announced new Copilot features.',
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
    canonicalHeadline: story.headline,
    summary: story.summary,
    primaryCategory: 'ai-tech',
    stories: [story],
    publishers: ['TechCrunch'],
    storyCount: 1,
    publisherCount: 1,
    firstPublished: story.publishedAt,
    latestPublished: story.publishedAt,
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

  it('extracts entities and categorizes them correctly', () => {
    const entities = extractEntitiesFromCluster(cluster);
    const companyNames = entities.map(e => e.name);

    expect(companyNames).toContain('OpenAI');
    expect(companyNames).toContain('Microsoft');
    expect(companyNames).toContain('ChatGPT');
  });

  it('generates entity relationship triples', () => {
    const entities = extractEntitiesFromCluster(cluster);
    const rels = extractEntityRelationships(cluster, entities);

    expect(rels.length).toBeGreaterThan(0);
    expect(rels[0].subject).toBeDefined();
    expect(rels[0].predicate).toBeDefined();
    expect(rels[0].object).toBeDefined();
  });

});
