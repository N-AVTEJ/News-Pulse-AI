import { describe, it, expect } from 'vitest';
import { buildEvidenceGraph } from '../evidenceGraph';
import { evaluateVerificationRules } from '../rules';
import { EventCluster } from '../../clustering/types';
import { NewsStory } from '../../news/types';

describe('Evidence Graph Engine', () => {

  const story1: NewsStory = {
    id: 's1',
    headline: 'OpenAI Launches ChatGPT Desktop App',
    summary: 'New ChatGPT desktop app launched.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/s1',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  const storyGov: NewsStory = {
    id: 's2',
    headline: 'US Government Issues AI Safety Guidelines',
    summary: 'White House press release on AI framework.',
    sourceName: 'White House Press',
    sourceUrl: 'https://www.whitehouse.gov',
    articleUrl: 'https://www.whitehouse.gov/briefing/ai',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  it('builds nodes and edges for clusters, primary/secondary sources, and stories', () => {
    const cluster: EventCluster = {
      clusterId: 'evt_test',
      canonicalHeadline: 'OpenAI Launches ChatGPT Desktop App',
      summary: story1.summary,
      primaryCategory: 'ai-tech',
      stories: [story1, storyGov],
      publishers: ['TechCrunch', 'White House Press'],
      storyCount: 2,
      publisherCount: 2,
      firstPublished: story1.publishedAt,
      latestPublished: story1.publishedAt,
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

    const verification = evaluateVerificationRules(cluster);
    const graph = buildEvidenceGraph(cluster, verification);

    expect(graph.nodes.length).toBeGreaterThanOrEqual(4);
    expect(graph.edges.length).toBeGreaterThanOrEqual(3);

    const clusterNode = graph.nodes.find(n => n.type === 'CLUSTER');
    const primaryNode = graph.nodes.find(n => n.type === 'PRIMARY_SOURCE');
    const secondaryNode = graph.nodes.find(n => n.type === 'SECONDARY_SOURCE');

    expect(clusterNode).toBeDefined();
    expect(primaryNode).toBeDefined();
    expect(secondaryNode).toBeDefined();
  });

});
