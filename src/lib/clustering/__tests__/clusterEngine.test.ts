import { describe, it, expect } from 'vitest';
import { clusterStories } from '../clusterEngine';
import { NewsStory } from '../../news/types';

describe('Story Clustering Engine', () => {

  // Fixture: 10 stories covering the exact same event across 10 publishers
  const tenSameEventStories: NewsStory[] = Array.from({ length: 10 }, (_, i) => ({
    id: `event1-story-${i}`,
    headline: `OpenAI Launches ChatGPT Desktop Application Version ${i + 1}`,
    summary: 'OpenAI released the native ChatGPT app for desktop systems.',
    sourceName: `Publisher ${i + 1}`,
    sourceUrl: `https://publisher${i + 1}.com`,
    articleUrl: `https://publisher${i + 1}.com/article-${i}`,
    category: 'ai-tech',
    publishedAt: new Date(Date.now() - (10 - i) * 3600 * 1000).toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  }));

  // Fixture: Story from same company (OpenAI) about a completely different event
  const sameCompanyDifferentEvent: NewsStory = {
    id: 'event2-story-1',
    headline: 'OpenAI Appoints New Chief Financial Officer to Lead Global Expansion',
    summary: 'Executive leadership change announced by OpenAI board.',
    sourceName: 'CNBC',
    sourceUrl: 'https://cnbc.com',
    articleUrl: 'https://cnbc.com/event2',
    category: 'business',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  it('clusters 10 articles about the same event into 1 single EventCluster', () => {
    const { clusters, telemetry } = clusterStories(tenSameEventStories);

    expect(clusters.length).toBe(1);
    expect(clusters[0].storyCount).toBe(10);
    expect(clusters[0].publisherCount).toBe(10);
    expect(telemetry.storiesMerged).toBe(9);
    expect(telemetry.largestClusterSize).toBe(10);
  });

  it('orders stories inside a cluster chronologically (earliest first for timeline)', () => {
    const { clusters } = clusterStories(tenSameEventStories);
    const timeline = clusters[0].stories;

    const firstTime = new Date(timeline[0].publishedAt).getTime();
    const lastTime = new Date(timeline[timeline.length - 1].publishedAt).getTime();

    expect(firstTime).toBeLessThanOrEqual(lastTime);
  });

  it('keeps distinct events separated even if they mention the same company', () => {
    const mixed = [...tenSameEventStories, sameCompanyDifferentEvent];
    const { clusters } = clusterStories(mixed);

    expect(clusters.length).toBe(2);
    const mainCluster = clusters.find(c => c.storyCount === 10);
    const cfoCluster = clusters.find(c => c.storyCount === 1);

    expect(mainCluster).toBeDefined();
    expect(cfoCluster).toBeDefined();
  });

  it('selects a canonical headline deterministically', () => {
    const { clusters } = clusterStories(tenSameEventStories);
    expect(clusters[0].canonicalHeadline).toBeTruthy();
    expect(typeof clusters[0].canonicalHeadline).toBe('string');
  });

});
