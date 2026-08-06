import { EventCluster } from '../clustering/types';
import { BreakingState } from './types';

export interface BreakingEvaluation {
  breakingState: BreakingState;
  isBreaking: boolean;
  triggers: string[];
}

/**
 * Deterministically evaluates breaking signals for an EventCluster using transparent engineering rules.
 */
export function evaluateBreakingSignals(cluster: EventCluster): BreakingEvaluation {
  const triggers: string[] = [];
  const ver = cluster.verificationResult;
  const hasPrimary = (ver?.primarySources?.length || 0) > 0;
  const pubCount = cluster.publisherCount || 1;
  const storyCount = cluster.storyCount || 1;

  const latestTime = new Date(cluster.latestPublished).getTime();
  const firstTime = new Date(cluster.firstPublished).getTime();
  const durationHours = !isNaN(latestTime) && !isNaN(firstTime)
    ? (latestTime - firstTime) / (1000 * 3600)
    : 1;

  // Signal 1: High Publisher Velocity (>= 3 publishers in <= 4 hours)
  if (pubCount >= 3 && durationHours <= 4) {
    triggers.push(`High publisher velocity: ${pubCount} publishers reporting within ${durationHours.toFixed(1)} hours.`);
  }

  // Signal 2: Official Announcement Primary Source
  if (hasPrimary) {
    triggers.push(`Official primary announcement detected (${ver?.primarySources[0]?.sourceName}).`);
  }

  // Signal 3: Story Size Surge
  if (storyCount >= 5) {
    triggers.push(`Rapid cluster growth: ${storyCount} total reporting articles.`);
  }

  // Determine Breaking Lifecycle State
  let breakingState: BreakingState = 'DEVELOPING';

  if (triggers.length >= 2 || (pubCount >= 3 && hasPrimary)) {
    breakingState = 'BREAKING';
  } else if (ver?.verificationStatus === 'STRONG_CORROBORATION' && hasPrimary) {
    breakingState = 'CONFIRMED';
  } else if (Date.now() - latestTime > 48 * 3600 * 1000) {
    breakingState = 'ARCHIVED';
  } else if (pubCount >= 2) {
    breakingState = 'DEVELOPING';
  }

  return {
    breakingState,
    isBreaking: breakingState === 'BREAKING',
    triggers
  };
}

/**
 * Enriches a list of EventClusters with breakingState metadata.
 */
export function evaluateAllBreakingEvents(clusters: EventCluster[]): EventCluster[] {
  return clusters.map((c) => {
    const evalResult = evaluateBreakingSignals(c);
    return {
      ...c,
      breakingState: evalResult.breakingState
    };
  });
}
