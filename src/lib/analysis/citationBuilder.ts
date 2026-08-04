import { NewsStory } from '../news/types';
import { Citation } from './types';

/**
 * Builds structured Citation records for all reporting stories in an EventCluster.
 */
export function buildCitations(stories: NewsStory[]): Citation[] {
  if (!stories || stories.length === 0) return [];

  return stories.map((story, idx) => ({
    id: `cit_${story.id}_${idx + 1}`,
    storyId: story.id,
    publisherName: story.sourceName,
    articleUrl: story.articleUrl,
    headline: story.headline,
    publishedAt: story.publishedAt,
    quoteSnippet: story.summary?.substring(0, 140) || story.headline
  }));
}

/**
 * Validates that every citation references a valid original article URL.
 */
export function validateCitations(citations: Citation[], stories: NewsStory[]): {
  valid: boolean;
  missingCitations: string[];
} {
  const validStoryIds = new Set(stories.map((s) => s.id));
  const missingCitations: string[] = [];

  for (const cit of citations) {
    if (!validStoryIds.has(cit.storyId) || !cit.articleUrl) {
      missingCitations.push(cit.id);
    }
  }

  return {
    valid: missingCitations.length === 0,
    missingCitations
  };
}
