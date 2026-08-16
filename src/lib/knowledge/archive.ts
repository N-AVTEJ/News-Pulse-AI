import { EventCluster } from '../clustering/types';
import { ArchiveItem } from './types';

/**
 * Searches and returns historical intelligence archive items.
 */
export function getHistoricalArchive(
  clusters: EventCluster[],
  searchQuery?: string
): ArchiveItem[] {
  let archive: ArchiveItem[] = clusters.map((cluster) => ({
    id: `arch_${cluster.clusterId}`,
    headline: cluster.canonicalHeadline,
    summary: cluster.summary,
    category: cluster.primaryCategory,
    archivedAt: cluster.latestPublished,
    publisherCount: cluster.publisherCount
  }));

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    archive = archive.filter(
      (a) =>
        a.headline.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }

  return archive;
}
