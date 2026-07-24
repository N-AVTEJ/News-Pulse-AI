import { describe, it, expect } from 'vitest';
import { sanitizeText, parseNormalizedDate, mapCategory } from '../normalize';
import { normalizeHeadline, deduplicateStories } from '../deduplicate';
import { NewsStory } from '../types';

describe('News Ingestion Deterministic Logic', () => {

  describe('sanitizeText', () => {
    it('strips HTML tags cleanly', () => {
      const html = '<p>The <strong>Federal Reserve</strong> announced a <a href="#">rate decision</a>.</p>';
      expect(sanitizeText(html)).toBe('The Federal Reserve announced a rate decision.');
    });

    it('decodes HTML entities correctly', () => {
      const text = 'Tech &amp; Science &quot;Breakthroughs&#39; &amp; Innovations';
      expect(sanitizeText(text)).toBe('Tech & Science "Breakthroughs\' & Innovations');
    });

    it('handles empty or undefined inputs', () => {
      expect(sanitizeText('')).toBe('');
      expect(sanitizeText(undefined)).toBe('');
    });
  });

  describe('parseNormalizedDate', () => {
    it('parses valid RFC/ISO date strings', () => {
      const validRfc = 'Fri, 24 Jul 2026 14:20:00 GMT';
      const iso = parseNormalizedDate(validRfc);
      expect(iso).toContain('2026-07-24T14:20:00');
    });

    it('falls back gracefully to current ISO date for malformed inputs', () => {
      const malformed = 'Not-A-Valid-Date-String-12345';
      const iso = parseNormalizedDate(malformed);
      expect(iso).toBeTruthy();
      expect(isNaN(new Date(iso).getTime())).toBe(false);
    });
  });

  describe('mapCategory', () => {
    it('maps technology keywords to ai-tech', () => {
      expect(mapCategory('world', 'Artificial Intelligence')).toBe('ai-tech');
      expect(mapCategory('world', 'Cybersecurity Update')).toBe('ai-tech');
    });

    it('maps financial keywords to business', () => {
      expect(mapCategory('world', 'Global Markets & Economy')).toBe('business');
      expect(mapCategory('world', 'Financial Strategy')).toBe('business');
    });

    it('falls back to default source category', () => {
      expect(mapCategory('business', 'General News')).toBe('business');
    });
  });

  describe('normalizeHeadline', () => {
    it('converts to lowercase, removes punctuation and collapses whitespace', () => {
      const headline = '  BREAKING:   Quantum Computer, Achieves 99.9% Gate-Fidelity! ';
      expect(normalizeHeadline(headline)).toBe('breaking quantum computer achieves 999 gatefidelity');
    });
  });

  describe('deduplicateStories', () => {
    const story1: NewsStory = {
      id: '1',
      headline: 'Major Cloud Outage Hits Web Services',
      summary: 'Summary 1',
      sourceName: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com',
      articleUrl: 'https://techcrunch.com/article-1',
      category: 'ai-tech',
      publishedAt: '2026-07-24T12:00:00Z',
      retrievedAt: '2026-07-24T12:00:00Z',
      sourceType: 'rss',
      corroboratingSources: ['TechCrunch']
    };

    const story2DuplicateUrl: NewsStory = {
      ...story1,
      id: '2',
      headline: 'Major Cloud Outage Hits Web Services (Updated)',
      corroboratingSources: ['Ars Technica']
    };

    const story3DuplicateHeadline: NewsStory = {
      id: '3',
      headline: 'Major Cloud Outage Hits Web Services',
      summary: 'Summary 3',
      sourceName: 'Wired',
      sourceUrl: 'https://wired.com',
      articleUrl: 'https://wired.com/different-url',
      category: 'ai-tech',
      publishedAt: '2026-07-24T12:05:00Z',
      retrievedAt: '2026-07-24T12:05:00Z',
      sourceType: 'rss',
      corroboratingSources: ['Wired']
    };

    const story4Unique: NewsStory = {
      id: '4',
      headline: 'Central Banks Announce Rate Decision',
      summary: 'Summary 4',
      sourceName: 'CNBC',
      sourceUrl: 'https://cnbc.com',
      articleUrl: 'https://cnbc.com/article-4',
      category: 'business',
      publishedAt: '2026-07-24T12:10:00Z',
      retrievedAt: '2026-07-24T12:10:00Z',
      sourceType: 'rss',
      corroboratingSources: ['CNBC']
    };

    it('deduplicates duplicate URLs and headlines while capturing corroborating outlets', () => {
      const input = [story1, story2DuplicateUrl, story3DuplicateHeadline, story4Unique];
      const result = deduplicateStories(input);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[0].corroboratingSources).toContain('TechCrunch');
      expect(result[0].corroboratingSources).toContain('Wired');
      expect(result[1].id).toBe('4');
    });
  });

});
