import crypto from 'crypto';
import { NewsCategory, NewsStory, SourceConfig } from './types';

/**
 * Strips HTML tags, decodes common HTML entities, and trims whitespace.
 */
export function sanitizeText(input?: string): string {
  if (!input) return '';

  // Strip HTML tags
  let text = input.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--');

  // Collapse multiple whitespaces and trim
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Parses raw pubDate string into a valid ISO 8601 string, falling back to now if invalid.
 */
export function parseNormalizedDate(dateStr?: string): string {
  if (!dateStr) {
    return new Date().toISOString();
  }

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

/**
 * Creates a deterministic unique story ID.
 */
export function generateStoryId(sourceId: string, articleUrl: string, guid?: string): string {
  const seed = guid || articleUrl || `${sourceId}-${Date.now()}`;
  const hash = crypto.createHash('md5').update(seed).digest('hex').substring(0, 12);
  return `${sourceId}-${hash}`;
}

/**
 * Maps raw source category into normalized app category.
 */
export function mapCategory(defaultCategory: NewsCategory, rawCategory?: string): NewsCategory {
  if (!rawCategory) return defaultCategory;
  const lower = rawCategory.toLowerCase();

  if (
    lower.includes('tech') ||
    lower.includes('ai') ||
    lower.includes('software') ||
    lower.includes('cyber') ||
    lower.includes('intel') ||
    lower.includes('computer') ||
    lower.includes('quantum') ||
    lower.includes('data')
  ) {
    return 'ai-tech';
  }
  if (lower.includes('bus') || lower.includes('econ') || lower.includes('market') || lower.includes('finan')) {
    return 'business';
  }
  if (lower.includes('world') || lower.includes('glob') || lower.includes('internat')) {
    return 'world';
  }

  return defaultCategory;
}

/**
 * Converts a raw RSS/Atom feed item into a normalized NewsStory object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeRssItem(item: any, source: SourceConfig): NewsStory {
  const articleUrl = item.link || item.guid || source.homepageUrl;
  const headline = sanitizeText(item.title) || 'Untitled News Release';
  
  // Extract summary from description, contentSnippet, or content
  const rawSummary = item.contentSnippet || item.description || item.content || '';
  const summary = sanitizeText(rawSummary);

  const publishedAt = parseNormalizedDate(item.pubDate || item.isoDate || item.date);
  const category = mapCategory(source.category, Array.isArray(item.categories) ? item.categories[0] : item.categories);

  // Extract author if available
  const author = item.creator || item.author || undefined;

  // Extract enclosure or media image if available
  let imageUrl: string | undefined = undefined;
  if (item.enclosure && item.enclosure.url) {
    imageUrl = item.enclosure.url;
  } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    imageUrl = item['media:content'].$.url;
  }

  return {
    id: generateStoryId(source.id, articleUrl, item.guid),
    headline,
    summary,
    sourceName: source.name,
    sourceUrl: source.homepageUrl,
    articleUrl,
    category,
    publishedAt,
    retrievedAt: new Date().toISOString(),
    author: author ? sanitizeText(author) : undefined,
    imageUrl,
    sourceType: source.sourceType,
    corroboratingSources: [source.name],
    
    // Reserved Phase 3+ intelligence fields remain null/undefined for real stories in Phase 2
    importanceScore: null,
    confidenceScore: null,
    verificationStatus: null
  };
}
