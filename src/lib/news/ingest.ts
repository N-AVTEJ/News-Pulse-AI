import Parser from 'rss-parser';
import { getEnabledSources, getSourceById } from './sources';
import { IngestionResponse, NewsCategory, NewsStory, SourceConfig, SourceStatus } from './types';
import { normalizeRssItem } from './normalize';
import { deduplicateStories } from './deduplicate';

const parser = new Parser({
  timeout: 6000, // 6s timeout per feed
  headers: {
    'User-Agent': 'NewsPulse-Intelligence-Bot/1.0 (+https://newspulse.ai)'
  }
});

// Server-side in-memory cache
interface CacheEntry {
  response: IngestionResponse;
  cachedAt: number;
}

let memoryCache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minutes

/**
 * Fetches and parses a single RSS source with error handling and timing metrics.
 */
async function fetchSource(source: SourceConfig): Promise<{ stories: NewsStory[]; status: SourceStatus }> {
  const startTime = Date.now();
  console.log(`[IngestionLog] [START] Fetching source: ${source.name} (${source.id}) - URL: ${source.feedUrl}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(source.feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'NewsPulse-Intelligence-Bot/1.0 (+https://newspulse.ai)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
      },
      next: { revalidate: 300 } // Next.js fetch revalidation fallback
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const xmlText = await res.text();
    const feed = await parser.parseString(xmlText);

    const stories: NewsStory[] = (feed.items || []).map((item) => normalizeRssItem(item, source));
    const duration = Date.now() - startTime;

    console.log(`[IngestionLog] [SUCCESS] ${source.name}: Retrived ${stories.length} stories in ${duration}ms`);

    const status: SourceStatus = {
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      enabled: source.enabled,
      status: 'SUCCESS',
      storiesRetrieved: stories.length,
      fetchDurationMs: duration,
      lastSuccessAt: new Date().toISOString()
    };

    return { stories, status };
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : 'Unknown fetch error';
    console.error(`[IngestionLog] [FAILED] ${source.name}: ${errorMsg} after ${duration}ms`);

    const status: SourceStatus = {
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      enabled: source.enabled,
      status: 'FAILED',
      storiesRetrieved: 0,
      fetchDurationMs: duration,
      lastError: errorMsg
    };

    return { stories: [], status };
  }
}

/**
 * Main ingestion function. Executes parallel fetches across enabled sources.
 */
export async function ingestNews(options?: {
  category?: NewsCategory;
  sourceId?: string;
  forceRefresh?: boolean;
}): Promise<IngestionResponse> {
  const forceRefresh = options?.forceRefresh ?? false;
  const now = Date.now();

  // Return cached result if valid and refresh not requested
  if (!forceRefresh && memoryCache && (now - memoryCache.cachedAt < CACHE_TTL_MS)) {
    console.log('[IngestionLog] [CACHE HIT] Returning cached ingestion response.');
    return filterIngestionResponse(memoryCache.response, options?.category, options?.sourceId);
  }

  console.log('[IngestionLog] [CACHE MISS / REFRESH] Initiating fresh ingestion scan...');

  let sourcesToFetch = getEnabledSources();
  if (options?.sourceId) {
    const matched = getSourceById(options.sourceId);
    if (matched) sourcesToFetch = [matched];
  }

  // Fault-tolerant parallel fetching using Promise.allSettled
  const fetchPromises = sourcesToFetch.map((src) => fetchSource(src));
  const results = await Promise.allSettled(fetchPromises);

  const rawStories: NewsStory[] = [];
  const sourceStatuses: SourceStatus[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      rawStories.push(...result.value.stories);
      sourceStatuses.push(result.value.status);
    }
  }

  // Deduplicate across all retrieved sources
  const deduplicatedStories = deduplicateStories(rawStories);

  // Sort by publishedAt descending (newest first)
  deduplicatedStories.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const fullResponse: IngestionResponse = {
    stories: deduplicatedStories,
    total: deduplicatedStories.length,
    retrievedAt: new Date().toISOString(),
    sourceStatus: sourceStatuses
  };

  // Update memory cache
  memoryCache = {
    response: fullResponse,
    cachedAt: Date.now()
  };

  return filterIngestionResponse(fullResponse, options?.category, options?.sourceId);
}

/**
 * Helper to filter response by category or source
 */
function filterIngestionResponse(
  fullResponse: IngestionResponse,
  category?: NewsCategory,
  sourceId?: string
): IngestionResponse {
  let filteredStories = fullResponse.stories;

  if (category) {
    filteredStories = filteredStories.filter((s) => s.category === category);
  }

  if (sourceId) {
    const sourceObj = getSourceById(sourceId);
    if (sourceObj) {
      filteredStories = filteredStories.filter((s) => s.sourceName === sourceObj.name);
    }
  }

  return {
    ...fullResponse,
    stories: filteredStories,
    total: filteredStories.length
  };
}
