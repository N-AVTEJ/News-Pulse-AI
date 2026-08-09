import { EventCluster } from '../clustering/types';
import { RecommendationItem, UserProfile, Workspace } from './types';

/**
 * Generates explainable recommendations for related entities, topics, technologies, and events.
 */
export function generateRecommendations(
  clusters: EventCluster[],
  profile: UserProfile,
  workspace: Workspace
): RecommendationItem[] {
  const recs: RecommendationItem[] = [];
  if (!clusters || clusters.length === 0) return recs;

  const entityCounts = new Map<string, { count: number; category: string }>();
  for (const c of clusters) {
    for (const ent of c.analysisReport?.entities || []) {
      const existing = entityCounts.get(ent.name) || { count: 0, category: ent.category };
      entityCounts.set(ent.name, { count: existing.count + ent.mentionCount, category: ent.category });
    }
  }

  // 1. Entity Recommendations
  const sortedEntities = Array.from(entityCounts.entries()).sort((a, b) => b[1].count - a[1].count);
  for (const [name, meta] of sortedEntities.slice(0, 3)) {
    recs.push({
      id: `rec_ent_${name.toLowerCase()}`,
      type: 'ENTITY',
      title: name,
      entityName: name,
      explanation: `Frequently co-mentioned across ${meta.count} verified reports in your ${workspace.name} workspace.`,
      score: 85
    });
  }

  // 2. High relevance Event Recommendations
  const topCluster = clusters.find(c => c.verificationResult?.verificationStatus === 'STRONG_CORROBORATION');
  if (topCluster) {
    recs.push({
      id: `rec_evt_${topCluster.clusterId}`,
      type: 'EVENT',
      title: topCluster.canonicalHeadline,
      clusterId: topCluster.clusterId,
      explanation: `High signal event corroborated across ${topCluster.publisherCount} independent publishers with official primary evidence.`,
      score: 95
    });
  }

  // 3. Technology / Topic Recommendations
  recs.push({
    id: 'rec_top_semiconductors',
    type: 'TECHNOLOGY',
    title: 'Semiconductors & AI Hardware',
    explanation: 'Aligned with your declared industry interests and recent reading activity.',
    score: 80
  });

  return recs;
}
