import { EventCluster } from '../clustering/types';
import { calculateRelevanceScore } from './ranking';
import { UserProfile, Workspace } from './types';

/**
 * Generates a ranked Personal Intelligence Feed with explainable relevance scores and match reasons.
 */
export function generatePersonalFeed(
  clusters: EventCluster[],
  profile: UserProfile,
  workspace: Workspace
): EventCluster[] {
  if (!clusters || clusters.length === 0) return [];

  const enriched = clusters.map((cluster) => {
    const { relevanceScore, matchReasons } = calculateRelevanceScore(cluster, profile, workspace);
    return {
      ...cluster,
      relevanceScore,
      matchReasons
    };
  });

  // Sort by relevance score descending -> latest published time
  return enriched.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return new Date(b.latestPublished).getTime() - new Date(a.latestPublished).getTime();
  });
}
