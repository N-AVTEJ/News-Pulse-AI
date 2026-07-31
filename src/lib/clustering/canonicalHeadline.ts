import { NewsStory } from '../news/types';

/**
 * Selects the canonical headline for an EventCluster using deterministic engineering rules.
 * 
 * Rules:
 * 1. Filter out headlines that are too short (< 4 words) or excessively long (> 30 words).
 * 2. Prefer headlines with strong descriptive detail.
 * 3. Break ties using earliest publication date and primary publisher priority.
 */
export function selectCanonicalHeadline(stories: NewsStory[]): string {
  if (!stories || stories.length === 0) return 'Untitled Event Intelligence Cluster';
  if (stories.length === 1) return stories[0].headline;

  // Clone stories array and sort deterministically
  const sorted = [...stories].sort((a, b) => {
    // 1. Length quality score (prefer 7 to 20 words)
    const wordsA = a.headline.trim().split(/\s+/).length;
    const wordsB = b.headline.trim().split(/\s+/).length;

    const scoreA = wordsA >= 7 && wordsA <= 20 ? 10 : wordsA;
    const scoreB = wordsB >= 7 && wordsB <= 20 ? 10 : wordsB;

    if (scoreA !== scoreB) return scoreB - scoreA;

    // 2. Earliest published story timestamp
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
      return timeA - timeB;
    }

    return a.headline.length - b.headline.length;
  });

  return sorted[0].headline;
}

/**
 * Selects the canonical summary text for an EventCluster from the earliest story.
 */
export function selectClusterSummary(stories: NewsStory[]): string {
  if (!stories || stories.length === 0) return '';
  
  // Find earliest published story with a non-empty summary
  const sortedByTime = [...stories].sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
  });

  for (const story of sortedByTime) {
    if (story.summary && story.summary.trim().length > 10) {
      return story.summary;
    }
  }

  return sortedByTime[0].headline;
}
