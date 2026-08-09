import { EventCluster } from '../clustering/types';

export interface TrendAnalytics {
  topDiscussedCompanies: { name: string; count: number }[];
  topTechnologies: { name: string; count: number }[];
  fastestGrowingTopics: { topic: string; count: number }[];
  categoryDistribution: Record<string, number>;
}

export function computeTrendAnalytics(clusters: EventCluster[]): TrendAnalytics {
  const companyCounts = new Map<string, number>();
  const techCounts = new Map<string, number>();
  const topicCounts = new Map<string, number>();
  const categoryDistribution: Record<string, number> = {};

  for (const cluster of clusters) {
    categoryDistribution[cluster.primaryCategory] = (categoryDistribution[cluster.primaryCategory] || 0) + 1;

    for (const ent of cluster.analysisReport?.entities || []) {
      if (ent.category === 'COMPANY') {
        companyCounts.set(ent.name, (companyCounts.get(ent.name) || 0) + ent.mentionCount);
      } else if (ent.category === 'TECHNOLOGY' || ent.category === 'PRODUCT') {
        techCounts.set(ent.name, (techCounts.get(ent.name) || 0) + ent.mentionCount);
      }
    }

    for (const sig of cluster.matchedSignals || []) {
      topicCounts.set(sig, (topicCounts.get(sig) || 0) + 1);
    }
  }

  const topDiscussedCompanies = Array.from(companyCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topTechnologies = Array.from(techCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const fastestGrowingTopics = Array.from(topicCounts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    topDiscussedCompanies,
    topTechnologies,
    fastestGrowingTopics,
    categoryDistribution
  };
}
