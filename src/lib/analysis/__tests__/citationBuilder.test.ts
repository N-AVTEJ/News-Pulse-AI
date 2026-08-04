import { describe, it, expect } from 'vitest';
import { buildCitations, validateCitations } from '../citationBuilder';
import { NewsStory } from '../../news/types';

describe('Citation Builder & Validator', () => {

  const story1: NewsStory = {
    id: 's1',
    headline: 'OpenAI Launches ChatGPT Desktop Application',
    summary: 'OpenAI official release of desktop app.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/2026/openai-desktop',
    category: 'ai-tech',
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    sourceType: 'rss'
  };

  it('builds structured Citations for all reporting stories', () => {
    const citations = buildCitations([story1]);

    expect(citations.length).toBe(1);
    expect(citations[0].storyId).toBe('s1');
    expect(citations[0].publisherName).toBe('TechCrunch');
    expect(citations[0].articleUrl).toBe('https://techcrunch.com/2026/openai-desktop');
  });

  it('validates citations against valid original articles', () => {
    const citations = buildCitations([story1]);
    const validation = validateCitations(citations, [story1]);

    expect(validation.valid).toBe(true);
    expect(validation.missingCitations.length).toBe(0);
  });

});
