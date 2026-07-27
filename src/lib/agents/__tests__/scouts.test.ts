import { describe, it, expect } from 'vitest';
import { techScout } from '../scouts/techScout';
import { businessScout } from '../scouts/businessScout';
import { worldScout } from '../scouts/worldScout';
import { NewsStory } from '../../news/types';

describe('Individual Scout Selection Logic', () => {

  const techStory: NewsStory = {
    id: 'story-tech',
    headline: 'Open-Source AI Collective Unveils New LLM Weights',
    summary: 'A new 70B parameter model released with benchmark scores.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/story-tech',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss',
    corroboratingSources: ['TechCrunch']
  };

  const businessStory: NewsStory = {
    id: 'story-biz',
    headline: 'Central Bank Adjusts Interest Rates Following Q3 Earnings Surge',
    summary: 'Quarterly financial reports show 4% margin increase across markets.',
    sourceName: 'CNBC',
    sourceUrl: 'https://cnbc.com',
    articleUrl: 'https://cnbc.com/story-biz',
    category: 'business',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss',
    corroboratingSources: ['CNBC']
  };

  const worldStory: NewsStory = {
    id: 'story-world',
    headline: 'UN International Summit Signs Maritime Infrastructure Agreement',
    summary: 'Global diplomats vote on treaty governing deep ocean rights.',
    sourceName: 'BBC World News',
    sourceUrl: 'https://bbc.com',
    articleUrl: 'https://bbc.com/story-world',
    category: 'world',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss',
    corroboratingSources: ['BBC World News']
  };

  it('Tech Scout selects technology story above threshold', async () => {
    const result = await techScout.execute([techStory, businessStory, worldStory]);
    expect(result.status).toBe('COMPLETED');
    expect(result.storiesSelected).toBeGreaterThanOrEqual(1);
    expect(result.results[0].story.id).toBe('story-tech');
    expect(result.results[0].matchedSignals).toContain('MODEL_RELEASE');
  });

  it('Business Scout selects business story above threshold', async () => {
    const result = await businessScout.execute([techStory, businessStory, worldStory]);
    expect(result.status).toBe('COMPLETED');
    expect(result.storiesSelected).toBeGreaterThanOrEqual(1);
    expect(result.results[0].story.id).toBe('story-biz');
  });

  it('World Scout selects world story above threshold', async () => {
    const result = await worldScout.execute([techStory, businessStory, worldStory]);
    expect(result.status).toBe('COMPLETED');
    expect(result.storiesSelected).toBeGreaterThanOrEqual(1);
    const worldMatch = result.results.find(r => r.story.id === 'story-world');
    expect(worldMatch).toBeDefined();
  });

});
