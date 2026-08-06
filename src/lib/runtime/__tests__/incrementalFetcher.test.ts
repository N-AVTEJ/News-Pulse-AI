import { describe, it, expect, beforeEach } from 'vitest';
import { detectIncrementalNews, resetSnapshotCache } from '../incrementalFetcher';
import { NewsStory } from '../../news/types';

describe('Incremental News Fetcher', () => {

  beforeEach(() => {
    resetSnapshotCache();
  });

  const story1: NewsStory = {
    id: 's1',
    headline: 'OpenAI Unveils ChatGPT Desktop App',
    summary: 'New desktop app launched.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/s1',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  const story2: NewsStory = {
    id: 's2',
    headline: 'Nvidia Unveils Next-Gen GPU Architecture',
    summary: '5x speedup for AI models.',
    sourceName: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    articleUrl: 'https://arstechnica.com/s2',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  it('detects all stories as new on initial snapshot', () => {
    const res = detectIncrementalNews([story1, story2]);
    expect(res.newStories.length).toBe(2);
    expect(res.hasNewContent).toBe(true);
  });

  it('identifies unchanged stories on subsequent run with identical IDs', () => {
    detectIncrementalNews([story1]); // Initial run
    const res2 = detectIncrementalNews([story1, story2]); // Second run with story2 added

    expect(res2.newStories.length).toBe(1);
    expect(res2.newStories[0].id).toBe('s2');
    expect(res2.unchangedStories.length).toBe(1);
  });

});
