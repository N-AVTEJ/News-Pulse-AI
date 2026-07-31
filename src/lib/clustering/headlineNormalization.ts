const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'of', 'to', 'for', 'with', 'on', 'at', 'by', 
  'from', 'as', 'is', 'was', 'were', 'has', 'have', 'had', 'it', 'its', 'that', 'this', 
  'be', 'are', 'will', 'says', 'said', 'about', 'after', 'new', 'over', 'out', 'into'
]);

const KNOWN_ENTITIES = [
  'openai', 'chatgpt', 'gpt-4', 'gpt-4o', 'claude', 'anthropic', 'gemini', 'google', 
  'nvidia', 'tsmc', 'microsoft', 'apple', 'meta', 'amazon', 'intel', 'amd', 
  'sec', 'ftc', 'fed', 'federal reserve', 'biden', 'trump', 'eu', 'european union', 
  'us', 'united states', 'china', 'uk', 'ukraine', 'israel', 'techcrunch', 'reuters', 
  'bloomberg', 'cnbc', 'bbc', 'wired', 'ars technica', 'npr'
];

/**
 * Advanced headline text normalization for clustering.
 * Handles case, punctuation, quotes, hyphens, possessives ('s), unicode, and stop words.
 */
export function normalizeHeadlineForClustering(text: string): string {
  if (!text) return '';

  let normalized = text.toLowerCase();

  // Remove possessives ('s, ’s)
  normalized = normalized.replace(/['’]s\b/g, '');

  // Convert unicode quotes and hyphens to standard spaces
  normalized = normalized.replace(/[“”"'’`\-–—]/g, ' ');

  // Strip all remaining non-alphanumeric characters (except whitespace)
  normalized = normalized.replace(/[^a-z0-9\s]/g, ' ');

  // Split into tokens, filter out stop words and empty tokens
  const tokens = normalized
    .split(/\s+/)
    .filter(token => token.length > 0 && !STOP_WORDS.has(token));

  return tokens.join(' ');
}

/**
 * Extracts key named entities (organizations, products, locations) from headline text.
 */
export function extractEntities(text: string): Set<string> {
  const entities = new Set<string>();
  if (!text) return entities;

  const textLower = text.toLowerCase();

  // Match known entity keywords
  for (const entity of KNOWN_ENTITIES) {
    if (textLower.includes(entity)) {
      entities.add(entity);
    }
  }

  // Also extract capitalized tokens (potential proper nouns from raw headline)
  const rawTokens = text.split(/\s+/);
  for (const token of rawTokens) {
    const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanToken.length >= 3 && /^[A-Z][a-z]+$/.test(cleanToken)) {
      const lower = cleanToken.toLowerCase();
      if (!STOP_WORDS.has(lower)) {
        entities.add(lower);
      }
    }
  }

  return entities;
}
