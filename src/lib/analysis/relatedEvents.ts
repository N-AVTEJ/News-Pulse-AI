import { EventCluster } from '../clustering/types';
import { extractEntitiesFromCluster } from './entityExtractor';
import { RelatedEventSummary } from './types';

/**
 * Finds related Event Clusters for a target cluster based on shared entities, companies, and category alignment.
 */
export function findRelatedEvents(
  targetCluster: EventCluster,
  allClusters: EventCluster[]
): RelatedEventSummary[] {
  if (!allClusters || allClusters.length <= 1) return [];

  const targetEntities = new Set(
    extractEntitiesFromCluster(targetCluster).map((e) => e.name.toLowerCase())
  );

  const related: RelatedEventSummary[] = [];

  for (const other of allClusters) {
    if (other.clusterId === targetCluster.clusterId) continue;

    const otherEntities = extractEntitiesFromCluster(other).map((e) => e.name.toLowerCase());
    const shared = otherEntities.filter((e) => targetEntities.has(e));

    let score = 0;
    if (shared.length > 0) score += shared.length * 30;
    if (other.primaryCategory === targetCluster.primaryCategory) score += 20;

    if (score >= 30) {
      related.push({
        clusterId: other.clusterId,
        canonicalHeadline: other.canonicalHeadline,
        primaryCategory: other.primaryCategory,
        sharedEntities: shared.map(s => s.toUpperCase()),
        similarityScore: Math.min(score, 100)
      });
    }
  }

  return related.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 4);
}
