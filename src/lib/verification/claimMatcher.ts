import { NewsStory } from '../news/types';

export interface ExtractedClaim {
  storyId: string;
  sourceName: string;
  claimType: 'MONEY' | 'COUNT';
  rawValue: string;
  numericValue: number;
}

/**
 * Extracts monetary amounts and headcount numerical figures from text.
 */
export function extractNumericalClaims(text: string, storyId: string, sourceName: string): ExtractedClaim[] {
  const claims: ExtractedClaim[] = [];
  if (!text) return claims;

  // 1. Regex for Currency ($4.5M, $10 billion, $500,000, €100 million)
  const moneyRegex = /([$€£])\s*(\d+(?:\.\d+)?)\s*(billion|million|b|m|thousand|k)?/gi;
  let match: RegExpExecArray | null;

  while ((match = moneyRegex.exec(text)) !== null) {
    const rawValue = match[0];
    const val = parseFloat(match[2]);
    const multiplier = (match[3] || '').toLowerCase();

    let numericValue = val;
    if (multiplier === 'billion' || multiplier === 'b') numericValue *= 1_000_000_000;
    else if (multiplier === 'million' || multiplier === 'm') numericValue *= 1_000_000;
    else if (multiplier === 'thousand' || multiplier === 'k') numericValue *= 1_000;

    claims.push({
      storyId,
      sourceName,
      claimType: 'MONEY',
      rawValue,
      numericValue
    });
  }

  // 2. Regex for Headcount / Layoff / Worker numbers (e.g., 500 layoffs, 1,000 workers)
  const countRegex = /(\d+(?:,\d+)?)\s*(layoffs|jobs|employees|workers|people|units|deaths)/gi;
  while ((match = countRegex.exec(text)) !== null) {
    const rawValue = match[0];
    const numericValue = parseInt(match[1].replace(/,/g, ''), 10);

    if (!isNaN(numericValue) && numericValue > 0) {
      claims.push({
        storyId,
        sourceName,
        claimType: 'COUNT',
        rawValue,
        numericValue
      });
    }
  }

  return claims;
}

/**
 * Deterministically checks for reporting conflicts across stories in an EventCluster.
 */
export function detectClaimConflicts(stories: NewsStory[]): {
  hasConflict: boolean;
  conflicts: string[];
  conflictingStories: NewsStory[];
} {
  if (!stories || stories.length < 2) {
    return { hasConflict: false, conflicts: [], conflictingStories: [] };
  }

  const allClaims: ExtractedClaim[] = [];
  for (const story of stories) {
    const text = `${story.headline} ${story.summary}`;
    const claims = extractNumericalClaims(text, story.id, story.sourceName);
    allClaims.push(...claims);
  }

  const conflicts: string[] = [];
  const conflictingStoryIds = new Set<string>();

  // Compare MONEY claims
  const moneyClaims = allClaims.filter(c => c.claimType === 'MONEY');
  for (let i = 0; i < moneyClaims.length; i++) {
    for (let j = i + 1; j < moneyClaims.length; j++) {
      const c1 = moneyClaims[i];
      const c2 = moneyClaims[j];

      if (c1.sourceName !== c2.sourceName) {
        // If figures differ by more than 25% ratio
        const ratio = c1.numericValue > c2.numericValue 
          ? c1.numericValue / (c2.numericValue || 1) 
          : c2.numericValue / (c1.numericValue || 1);

        if (ratio >= 1.5 && Math.abs(c1.numericValue - c2.numericValue) > 100_000) {
          conflicts.push(`Contradictory monetary values reported: ${c1.sourceName} reported "${c1.rawValue}" vs ${c2.sourceName} reported "${c2.rawValue}"`);
          conflictingStoryIds.add(c1.storyId);
          conflictingStoryIds.add(c2.storyId);
        }
      }
    }
  }

  // Compare COUNT claims
  const countClaims = allClaims.filter(c => c.claimType === 'COUNT');
  for (let i = 0; i < countClaims.length; i++) {
    for (let j = i + 1; j < countClaims.length; j++) {
      const c1 = countClaims[i];
      const c2 = countClaims[j];

      if (c1.sourceName !== c2.sourceName) {
        const ratio = c1.numericValue > c2.numericValue 
          ? c1.numericValue / (c2.numericValue || 1) 
          : c2.numericValue / (c1.numericValue || 1);

        if (ratio >= 2.0 && Math.abs(c1.numericValue - c2.numericValue) >= 50) {
          conflicts.push(`Contradictory headcount figures reported: ${c1.sourceName} reported "${c1.rawValue}" vs ${c2.sourceName} reported "${c2.rawValue}"`);
          conflictingStoryIds.add(c1.storyId);
          conflictingStoryIds.add(c2.storyId);
        }
      }
    }
  }

  const conflictingStories = stories.filter(s => conflictingStoryIds.has(s.id));

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    conflictingStories
  };
}
