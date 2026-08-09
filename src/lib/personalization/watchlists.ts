import { EventCluster } from '../clustering/types';
import { Watchlist } from './types';

export interface WatchlistMatchResult {
  watchlistId: string;
  watchlistName: string;
  matchedEntities: string[];
  matchedKeywords: string[];
  score: number;
}

/**
 * Matches an EventCluster against a custom Watchlist's keywords, companies, products, and technologies.
 */
export function matchWatchlistRules(
  cluster: EventCluster,
  watchlist: Watchlist
): WatchlistMatchResult {
  const rules = watchlist.rules;
  const text = `${cluster.canonicalHeadline} ${cluster.summary} ${cluster.publishers.join(' ')}`.toLowerCase();

  // 1. Exclude keyword check
  for (const ex of rules.excludeKeywords || []) {
    if (ex && text.includes(ex.toLowerCase())) {
      return {
        watchlistId: watchlist.id,
        watchlistName: watchlist.name,
        matchedEntities: [],
        matchedKeywords: [],
        score: 0
      };
    }
  }

  const matchedKeywords: string[] = [];
  const matchedEntities: string[] = [];
  let score = 0;

  // 2. Keywords match
  for (const kw of rules.keywords || []) {
    if (kw && text.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
      score += 15;
    }
  }

  // 3. Companies & Products match
  const allTracked = [...(rules.companies || []), ...(rules.products || []), ...(rules.people || []), ...(rules.technologies || [])];
  for (const ent of allTracked) {
    if (ent && text.includes(ent.toLowerCase())) {
      matchedEntities.push(ent);
      score += 25;
    }
  }

  return {
    watchlistId: watchlist.id,
    watchlistName: watchlist.name,
    matchedEntities: Array.from(new Set(matchedEntities)),
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    score
  };
}

/**
 * Evaluates all active watchlists for a cluster.
 */
export function evaluateWatchlistsForCluster(
  cluster: EventCluster,
  watchlists: Watchlist[]
): WatchlistMatchResult[] {
  const matches: WatchlistMatchResult[] = [];

  for (const wl of watchlists) {
    const match = matchWatchlistRules(cluster, wl);
    if (match.score > 0) {
      matches.push(match);
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}
