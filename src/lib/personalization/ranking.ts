import { EventCluster } from '../clustering/types';
import { evaluateWatchlistsForCluster } from './watchlists';
import { UserProfile, Workspace } from './types';

export interface RelevanceScoreResult {
  relevanceScore: number;
  matchReasons: string[];
}

/**
 * Calculates a 0-100 relevance score and explainable match reasons for an EventCluster.
 */
export function calculateRelevanceScore(
  cluster: EventCluster,
  profile: UserProfile,
  workspace: Workspace
): RelevanceScoreResult {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Watchlist Rules Match (up to +35 pts)
  const wlMatches = evaluateWatchlistsForCluster(cluster, workspace.watchlists || []);
  if (wlMatches.length > 0) {
    const topWl = wlMatches[0];
    score += Math.min(topWl.score, 35);
    matchReasons.push(`Matches Watchlist [${topWl.watchlistName}]`);
    if (topWl.matchedEntities.length > 0) {
      matchReasons.push(`Tracked Entity: ${topWl.matchedEntities.join(', ')}`);
    }
  }

  // 2. Category Match (up to +20 pts)
  if (profile.preferredCategories.includes(cluster.primaryCategory)) {
    score += 20;
    matchReasons.push(`Preferred Category [${cluster.primaryCategory.toUpperCase()}]`);
  }

  // 3. Breaking News & High Corroboration (up to +25 pts)
  if (cluster.breakingState === 'BREAKING') {
    score += 25;
    matchReasons.push('Breaking News Alert');
  } else if (cluster.verificationResult?.verificationStatus === 'STRONG_CORROBORATION') {
    score += 15;
    matchReasons.push('Strong Corroboration (3+ Independent Outlets)');
  }

  // 4. Primary Source Presence (+10 pts)
  if ((cluster.verificationResult?.primarySources?.length || 0) > 0) {
    score += 10;
    matchReasons.push(`Primary Source Present [${cluster.verificationResult?.primarySources[0].sourceName}]`);
  }

  // 5. Default baseline for general intelligence (+10 pts)
  if (score === 0) {
    score = 15;
    matchReasons.push('General Intelligence Coverage');
  }

  const finalScore = Math.min(Math.round(score), 100);

  return {
    relevanceScore: finalScore,
    matchReasons
  };
}
