import { describe, it, expect } from 'vitest';
import { normalizeHeadlineForClustering, extractEntities } from '../headlineNormalization';

describe('Headline Normalization & Entity Extraction', () => {

  describe('normalizeHeadlineForClustering', () => {
    it('strips case, punctuation, quotes, hyphens, and possessives', () => {
      const raw = 'OpenAI’s New "GPT-4o" Model — Announced with Apple’s Copilot!';
      const normalized = normalizeHeadlineForClustering(raw);

      expect(normalized).not.toContain('’s');
      expect(normalized).not.toContain('"');
      expect(normalized).not.toContain('—');
      expect(normalized).toContain('openai');
      expect(normalized).toContain('gpt 4o');
      expect(normalized).toContain('apple');
    });

    it('removes common English stop words', () => {
      const raw = 'The new breakthrough in an artificial intelligence lab';
      const normalized = normalizeHeadlineForClustering(raw);

      expect(normalized).not.toContain(' the ');
      expect(normalized).not.toContain(' in ');
      expect(normalized).not.toContain(' an ');
      expect(normalized).toContain('breakthrough');
      expect(normalized).toContain('artificial');
      expect(normalized).toContain('intelligence');
    });
  });

  describe('extractEntities', () => {
    it('extracts known tech organizations, products, and locations', () => {
      const text = 'Microsoft and OpenAI partner with Nvidia in EU datacenter push';
      const entities = extractEntities(text);

      expect(entities.has('microsoft')).toBe(true);
      expect(entities.has('openai')).toBe(true);
      expect(entities.has('nvidia')).toBe(true);
      expect(entities.has('eu')).toBe(true);
    });
  });

});
