import { NewsStory } from './types';

/**
 * Normalizes a headline string for fuzzy/exact matching comparison.
 * Converts to lowercase, strips punctuation, and collapses whitespace.
 */
export function normalizeHeadline(headline: string): string {
  if (!headline) return '';

  return headline
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Strip punctuation
    .replace(/\s+/g, ' ')     // Collapse whitespace
    .trim();
}

/**
 * Deduplicates a list of NewsStory items.
 * Performs dual-stage deduplication:
 * 1. Exact Article URL match
 * 2. Normalized Headline match
 * 
 * Preserves corroborating source names when duplicates are merged.
 */
export function deduplicateStories(stories: NewsStory[]): NewsStory[] {
  const seenUrls = new Set<string>();
  const seenHeadlines = new Map<string, NewsStory>();
  const result: NewsStory[] = [];

  for (const story of stories) {
    // Stage 1: URL Check
    const cleanUrl = story.articleUrl.toLowerCase().trim();
    if (seenUrls.has(cleanUrl)) {
      continue;
    }

    // Stage 2: Normalized Headline Check
    const normHeadline = normalizeHeadline(story.headline);
    if (!normHeadline) continue;

    if (seenHeadlines.has(normHeadline)) {
      // Duplicate detected! Append source attribution to existing story's corroboratingSources
      const existing = seenHeadlines.get(normHeadline)!;
      if (existing.corroboratingSources && !existing.corroboratingSources.includes(story.sourceName)) {
        existing.corroboratingSources.push(story.sourceName);
      }
      continue;
    }

    // New unique story
    seenUrls.add(cleanUrl);
    seenHeadlines.set(normHeadline, story);
    result.push(story);
  }

  return result;
}
