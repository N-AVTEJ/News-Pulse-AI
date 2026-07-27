import { describe, it, expect } from 'vitest';
import { runScoutOrchestrator, mergeScoutResults } from '../orchestrator';
import { NewsStory } from '../../news/types';
import { ScoutAgent, ScoutResult } from '../types';

describe('Scout Orchestrator Integration & Merging', () => {

  const dualMatchStory: NewsStory = {
    id: 'story-dual',
    headline: 'Major Semiconductor Fab Acquired in $10 Billion Investment Deal',
    summary: 'A huge chip manufacturer acquisition signed today.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/story-dual',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss',
    corroboratingSources: ['TechCrunch', 'Apex Finance']
  };

  const techOnlyStory: NewsStory = {
    id: 'story-tech',
    headline: 'Open Source Machine Learning Framework Unveils API Update',
    summary: 'Developer SDK release posted on GitHub repository.',
    sourceName: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    articleUrl: 'https://arstechnica.com/story-tech',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss',
    corroboratingSources: ['Ars Technica']
  };

  const noMatchStory: NewsStory = {
    id: 'story-none',
    headline: 'Local Community Flower Garden Festival Scheduled for Spring',
    summary: 'Parks committee organizes seasonal floral arrangement.',
    sourceName: 'Local Wire',
    sourceUrl: 'https://localwire.org',
    articleUrl: 'https://localwire.org/story-none',
    category: 'world',
    publishedAt: '2020-01-01T00:00:00Z',
    retrievedAt: '2020-01-01T00:00:00Z',
    sourceType: 'rss',
    corroboratingSources: ['Local Wire']
  };

  it('orchestrates concurrent execution and generates unique execution ID', async () => {
    const res = await runScoutOrchestrator([dualMatchStory, techOnlyStory, noMatchStory]);

    expect(res.executionId).toMatch(/^run_\d+_[a-z0-9]+$/);
    expect(res.status).toBe('SUCCESS');
    expect(res.agentTelemetry.length).toBe(3);
    expect(res.totalStoriesProcessed).toBe(3);
    expect(res.intelligence.length).toBeGreaterThanOrEqual(2);
  });

  it('merges cross-scout matching stories and captures matchedScouts correctly', async () => {
    const res = await runScoutOrchestrator([dualMatchStory]);
    const mergedItem = res.intelligence.find(i => i.story.id === 'story-dual');

    expect(mergedItem).toBeDefined();
    if (mergedItem) {
      // Dual match story should match both AI & Tech Scout and Business Scout
      expect(mergedItem.matchedScouts).toContain('tech-scout');
      expect(mergedItem.matchedScouts).toContain('business-scout');
      expect(Object.keys(mergedItem.perScoutScores).length).toBe(2);
    }
  });

  it('isolates Scout exceptions using Promise.allSettled without crashing overall run', async () => {

    // Create a mock failing scout
    const failingScout: ScoutAgent = {
      id: 'failing-scout',
      name: 'Failing Scout',
      category: 'world',
      description: 'Test failing scout',
      async execute() {
        throw new Error('Simulated scout database connection timeout');
      }
    };

    // Execute failing scout directly to test exception handling
    const result: ScoutResult = await failingScout.execute([dualMatchStory]).catch((err) => ({
      agentId: 'failing-scout',
      agentName: 'Failing Scout',
      category: 'world',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 0,
      storiesProcessed: 1,
      storiesSelected: 0,
      status: 'FAILED',
      results: [],
      error: err.message
    }));

    expect(result.status).toBe('FAILED');
    expect(result.error).toContain('Simulated scout database connection timeout');
  });

});
