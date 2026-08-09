import { EventCluster } from '../clustering/types';
import { evaluateWatchlistsForCluster } from './watchlists';
import { PersonalAlert, Workspace } from './types';

const sentAlertKeys = new Set<string>();

export function generatePersonalAlerts(
  clusters: EventCluster[],
  workspace: Workspace
): PersonalAlert[] {
  const alerts: PersonalAlert[] = [];

  for (const cluster of clusters) {
    // 1. Watchlist Match Alert
    const matches = evaluateWatchlistsForCluster(cluster, workspace.watchlists || []);
    if (matches.length > 0) {
      const topMatch = matches[0];
      const alertKey = `alert_wl_${workspace.id}_${cluster.clusterId}_${topMatch.watchlistId}`;

      if (!sentAlertKeys.has(alertKey)) {
        sentAlertKeys.add(alertKey);

        alerts.push({
          id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'WATCHLIST_MATCH',
          title: `Watchlist Match: ${topMatch.watchlistName}`,
          message: `Cluster "${cluster.canonicalHeadline}" matched tracked entities (${topMatch.matchedEntities.join(', ')}).`,
          clusterId: cluster.clusterId,
          timestamp: new Date().toISOString(),
          read: false
        });
      }
    }

    // 2. Breaking News Alert
    if (cluster.breakingState === 'BREAKING') {
      const alertKey = `alert_brk_${workspace.id}_${cluster.clusterId}`;
      if (!sentAlertKeys.has(alertKey)) {
        sentAlertKeys.add(alertKey);

        alerts.push({
          id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'BREAKING_EVENT',
          title: `BREAKING: ${cluster.canonicalHeadline}`,
          message: `High velocity reporting across ${cluster.publisherCount} outlets.`,
          clusterId: cluster.clusterId,
          timestamp: new Date().toISOString(),
          read: false
        });
      }
    }
  }

  return alerts;
}
