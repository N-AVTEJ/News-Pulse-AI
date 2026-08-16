import { EventCluster } from '../clustering/types';
import { UnifiedTimelineEntry } from './types';

/**
 * Merges verified events, AI reports, investigation milestones, and verification updates into a single unified timeline.
 */
export function generateUnifiedTimeline(clusters: EventCluster[]): UnifiedTimelineEntry[] {
  const entries: UnifiedTimelineEntry[] = [];

  for (const cluster of clusters) {
    // 1. Cluster Event Entry
    entries.push({
      id: `timeline_evt_${cluster.clusterId}`,
      timestamp: cluster.latestPublished,
      type: 'EVENT',
      title: cluster.canonicalHeadline,
      summary: `Reported by ${cluster.publisherCount} publishers (${cluster.publishers.join(', ')}).`,
      sourceOrClusterId: cluster.clusterId
    });

    // 2. Verification Entry if strong corroboration
    if (cluster.verificationResult?.verificationStatus === 'STRONG_CORROBORATION') {
      entries.push({
        id: `timeline_ver_${cluster.clusterId}`,
        timestamp: cluster.verificationResult.generatedAt,
        type: 'VERIFICATION_UPGRADE',
        title: `Verification Upgraded: ${cluster.canonicalHeadline}`,
        summary: `Strong corroboration confirmed across ${cluster.verificationResult.independentSources} independent publishers.`,
        sourceOrClusterId: cluster.clusterId
      });
    }

    // 3. AI Analysis Report Entry
    if (cluster.analysisReport) {
      entries.push({
        id: `timeline_rpt_${cluster.clusterId}`,
        timestamp: cluster.analysisReport.generatedAt,
        type: 'REPORT',
        title: `AI Intelligence Report: ${cluster.canonicalHeadline}`,
        summary: cluster.analysisReport.executiveSummary,
        sourceOrClusterId: cluster.clusterId
      });
    }
  }

  // Sort chronologically descending (latest first)
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
