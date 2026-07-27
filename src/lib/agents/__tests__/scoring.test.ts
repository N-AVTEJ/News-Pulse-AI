import { describe, it, expect } from 'vitest';
import { detectSignals, calculateSelectionScore } from '../shared/scoring';
import { TECH_SIGNALS, BUSINESS_SIGNALS } from '../shared/keywords';
import { NewsStory } from '../../news/types';

describe('Scout Selection Scoring & Signal Detection', () => {

  describe('detectSignals', () => {
    it('detects AI model release and infrastructure keywords correctly', () => {
      const text = 'OpenAI announced LLM model weights release on GitHub alongside new GPU cluster compute';
      const signals = detectSignals(text, TECH_SIGNALS);

      expect(signals).toContain('MODEL_RELEASE');
      expect(signals).toContain('INFRASTRUCTURE');
      expect(signals).toContain('PLATFORM_CHANGE');
    });

    it('returns empty array when no keywords match', () => {
      const text = 'Local community garden opens new flower beds';
      const signals = detectSignals(text, TECH_SIGNALS);
      expect(signals.length).toEqual(0);
    });
  });

  describe('calculateSelectionScore', () => {
    const mockStory: NewsStory = {
      id: 'test-1',
      headline: 'Major Semiconductor Fab Unveils AI Chip Benchmark',
      summary: 'A leading chip manufacturer announced a new GPU accelerator.',
      sourceName: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com',
      articleUrl: 'https://techcrunch.com/test-1',
      category: 'ai-tech',
      publishedAt: new Date().toISOString(), // Recent (within 24h)
      retrievedAt: new Date().toISOString(),
      sourceType: 'rss',
      corroboratingSources: ['TechCrunch', 'Ars Technica'] // 2 corroborating outlets (+10)
    };

    it('calculates deterministic score and explainable breakdown correctly', () => {
      const matchedSignals = ['PRODUCT_LAUNCH', 'INFRASTRUCTURE'];
      const { score, breakdown, reason } = calculateSelectionScore(mockStory, 'ai-tech', matchedSignals);

      // Breakdown expected:
      // Category alignment: +25
      // Primary signal: +30
      // Secondary signals: +10 (1 additional signal)
      // Corroboration: +10 (2 outlets)
      // Recency: +10 (published today)
      // Total: 25 + 30 + 10 + 10 + 10 = 85
      expect(score).toEqual(85);
      expect(breakdown.categoryAlignment).toEqual(25);
      expect(breakdown.primarySignal).toEqual(30);
      expect(breakdown.secondarySignals).toEqual(10);
      expect(breakdown.corroboration).toEqual(10);
      expect(breakdown.recency).toEqual(10);
      expect(breakdown.total).toEqual(85);

      expect(reason).toContain('Aligned with ai-tech domain');
      expect(reason).toContain('PRODUCT_LAUNCH');
    });

    it('clamps final score to maximum of 100', () => {
      const storyHighCorroboration: NewsStory = {
        ...mockStory,
        corroboratingSources: ['A', 'B', 'C', 'D', 'E']
      };
      const manySignals = ['MODEL_RELEASE', 'PRODUCT_LAUNCH', 'SECURITY_INCIDENT', 'INFRASTRUCTURE'];
      const { score } = calculateSelectionScore(storyHighCorroboration, 'ai-tech', manySignals);

      expect(score).toBeLessThanOrEqual(100);
      expect(score).toEqual(100);
    });

    it('clamps final score to minimum of 0', () => {
      const storyOld: NewsStory = {
        ...mockStory,
        category: 'world',
        publishedAt: '2020-01-01T00:00:00Z',
        corroboratingSources: ['SingleSource']
      };
      const { score } = calculateSelectionScore(storyOld, 'ai-tech', []);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toEqual(0);
    });
  });

});
