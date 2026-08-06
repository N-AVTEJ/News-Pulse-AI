import { EventCluster } from '../clustering/types';

export interface ClusterChangeDelta {
  newEvents: EventCluster[];
  verificationUpgrades: { cluster: EventCluster; oldStatus: string; newStatus: string }[];
  newPrimaryStatements: { cluster: EventCluster; primarySource: string }[];
  timelineUpdates: EventCluster[];
  hasChanges: boolean;
}

/**
 * Deterministically checks for meaningful cluster changes between pipeline runs.
 */
export function detectClusterChanges(
  currentClusters: EventCluster[],
  previousClustersMap: Map<string, EventCluster> = new Map()
): ClusterChangeDelta {
  const newEvents: EventCluster[] = [];
  const verificationUpgrades: { cluster: EventCluster; oldStatus: string; newStatus: string }[] = [];
  const newPrimaryStatements: { cluster: EventCluster; primarySource: string }[] = [];
  const timelineUpdates: EventCluster[] = [];

  for (const curr of currentClusters) {
    const prev = previousClustersMap.get(curr.clusterId);

    if (!prev) {
      newEvents.push(curr);
    } else {
      // Check Verification Upgrade
      const prevStatus = prev.verificationResult?.verificationStatus || 'UNASSESSED';
      const currStatus = curr.verificationResult?.verificationStatus || 'UNASSESSED';
      if (prevStatus !== currStatus && currStatus === 'STRONG_CORROBORATION') {
        verificationUpgrades.push({ cluster: curr, oldStatus: prevStatus, newStatus: currStatus });
      }

      // Check New Primary Source Added
      const prevPrimaryCount = prev.verificationResult?.primarySources?.length || 0;
      const currPrimaryCount = curr.verificationResult?.primarySources?.length || 0;
      if (currPrimaryCount > prevPrimaryCount) {
        const newPrimary = curr.verificationResult?.primarySources[currPrimaryCount - 1]?.sourceName || 'Primary Source';
        newPrimaryStatements.push({ cluster: curr, primarySource: newPrimary });
      }

      // Check Timeline Growth
      if (curr.storyCount > prev.storyCount) {
        timelineUpdates.push(curr);
      }
    }
  }

  return {
    newEvents,
    verificationUpgrades,
    newPrimaryStatements,
    timelineUpdates,
    hasChanges: newEvents.length > 0 || verificationUpgrades.length > 0 || newPrimaryStatements.length > 0 || timelineUpdates.length > 0
  };
}
