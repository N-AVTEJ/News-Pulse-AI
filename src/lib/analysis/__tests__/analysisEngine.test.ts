import { describe, it, expect } from 'vitest';
import { generateAnalysisReport } from '../analysisEngine';
import { EventCluster } from '../../clustering/types';
import { NewsStory } from '../../news/types';

describe('AI Analysis Engine Orchestrator', () => {

  const story: NewsStory = {
    id: 's1',
    headline: 'Nvidia Unveils Next-Gen AI Microarchitecture',
    summary: 'New GPU platform delivers 5x performance boost for LLM training.',
    sourceName: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    articleUrl: 'https://arstechnica.com/nvidia-gpu',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  const cluster: EventCluster = {
    clusterId: 'evt_nvidia_gpu',
    canonicalHeadline: story.headline,
    summary: story.summary,
    primaryCategory: 'ai-tech',
    stories: [story],
    publishers: ['Ars Technica'],
    storyCount: 1,
    publisherCount: 1,
    firstPublished: story.publishedAt,
    latestPublished: story.publishedAt,
    matchedScouts: ['tech-scout'],
    matchedSignals: ['BREAKTHROUGH'],
    perScoutScores: {},
    topSelectionScore: 85,
    selectionReason: 'Matched BREAKTHROUGH',
    status: 'ACTIVE',
    clusterReason: '',
    clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
    importanceScore: null,
    verificationScore: null
  };

  it('generates a complete evidence-grounded AnalysisReport', async () => {
    const report = await generateAnalysisReport(cluster, [cluster]);

    expect(report.clusterId).toBe('evt_nvidia_gpu');
    expect(report.executiveSummary).toBeDefined();
    expect(report.citations.length).toBe(1);
    expect(report.citations[0].publisherName).toBe('Ars Technica');
    expect(report.entities.length).toBeGreaterThan(0);
    expect(report.potentialImpact.length).toBeGreaterThan(0);
    expect(report.remainingUncertainty.length).toBeGreaterThan(0);
    expect(report.validationPassed).toBe(true);
  });

});
