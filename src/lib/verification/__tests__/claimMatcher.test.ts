import { describe, it, expect } from 'vitest';
import { detectClaimConflicts, extractNumericalClaims } from '../claimMatcher';
import { NewsStory } from '../../news/types';

describe('Claim Matcher & Conflict Detection', () => {

  it('extracts monetary amounts and numerical figures correctly', () => {
    const text = 'Tech startup raised $4.5 million in series A funding and laid off 50 employees.';
    const claims = extractNumericalClaims(text, 's1', 'Publisher A');

    const moneyClaim = claims.find(c => c.claimType === 'MONEY');
    const countClaim = claims.find(c => c.claimType === 'COUNT');

    expect(moneyClaim).toBeDefined();
    expect(moneyClaim?.numericValue).toBe(4_500_000);

    expect(countClaim).toBeDefined();
    expect(countClaim?.numericValue).toBe(50);
  });

  it('detects contradictory numerical claims across publishers as CONFLICTING_REPORTS', () => {
    const story1: NewsStory = {
      id: 's1',
      headline: 'Tech Startup Raises $4.5 Million Series A',
      summary: 'Company secured $4.5M in round.',
      sourceName: 'Publisher Alpha',
      sourceUrl: 'https://alpha.com',
      articleUrl: 'https://alpha.com/1',
      category: 'business',
      publishedAt: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      sourceType: 'rss'
    };

    const story2: NewsStory = {
      id: 's2',
      headline: 'Tech Startup Raises $45 Million in Massive Funding Round',
      summary: 'Company secured $45M from venture investors.',
      sourceName: 'Publisher Beta',
      sourceUrl: 'https://beta.com',
      articleUrl: 'https://beta.com/2',
      category: 'business',
      publishedAt: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      sourceType: 'rss'
    };

    const conflict = detectClaimConflicts([story1, story2]);
    expect(conflict.hasConflict).toBe(true);
    expect(conflict.conflicts.length).toBeGreaterThan(0);
    expect(conflict.conflicts[0]).toContain('Contradictory monetary values reported');
  });

});
