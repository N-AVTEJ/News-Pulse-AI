import { describe, it, expect } from 'vitest';
import { calculateStorySimilarity, calculateJaccardSimilarity } from '../similarityEngine';
import { NewsStory } from '../../news/types';

describe('Similarity Engine & Score Calculator', () => {

  const storyA: NewsStory = {
    id: 's1',
    headline: 'OpenAI Unveils ChatGPT Desktop App with Voice Support',
    summary: 'ChatGPT Voice launches on desktop operating systems.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/s1',
    category: 'ai-tech',
    publishedAt: '2026-07-24T10:00:00Z',
    retrievedAt: '2026-07-24T10:05:00Z',
    sourceType: 'rss'
  };

  const storyB: NewsStory = {
    id: 's2',
    headline: 'OpenAI Launches Official ChatGPT Desktop Application',
    summary: 'Users can now access ChatGPT natively on desktop.',
    sourceName: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    articleUrl: 'https://arstechnica.com/s2',
    category: 'ai-tech',
    publishedAt: '2026-07-24T12:00:00Z',
    retrievedAt: '2026-07-24T12:05:00Z',
    sourceType: 'rss'
  };

  const storyDifferent: NewsStory = {
    id: 's3',
    headline: 'Federal Reserve Interest Rate Decision Announced',
    summary: 'Central bank maintains policy benchmark rates.',
    sourceName: 'CNBC',
    sourceUrl: 'https://cnbc.com',
    articleUrl: 'https://cnbc.com/s3',
    category: 'business',
    publishedAt: '2026-07-24T11:00:00Z',
    retrievedAt: '2026-07-24T11:05:00Z',
    sourceType: 'rss'
  };

  it('calculates high similarity score (>=50) for stories reporting the same event', () => {
    const { similarityScore, breakdown } = calculateStorySimilarity(storyA, storyB);

    expect(similarityScore).toBeGreaterThanOrEqual(50);
    expect(breakdown.headlineSimilarity).toBeGreaterThan(10);
    expect(breakdown.timeProximity).toEqual(20); // within 2h
  });

  it('calculates low similarity score (<40) for completely unrelated stories', () => {
    const { similarityScore } = calculateStorySimilarity(storyA, storyDifferent);
    expect(similarityScore).toBeLessThan(40);
  });

});
