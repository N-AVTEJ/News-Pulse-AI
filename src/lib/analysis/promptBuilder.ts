import { EventCluster } from '../clustering/types';
import { PromptContext } from './types';

/**
 * Constructs a strict, evidence-grounded prompt context from an EventCluster.
 */
export function buildPromptContext(cluster: EventCluster): PromptContext {
  const stories = (cluster.stories || []).map((s) => ({
    id: s.id,
    headline: s.headline,
    summary: s.summary,
    publisherName: s.sourceName,
    articleUrl: s.articleUrl,
    publishedAt: s.publishedAt
  }));

  const primarySources = (cluster.verificationResult?.primarySources || []).map(
    (s) => `${s.sourceName} (${s.articleUrl})`
  );

  return {
    clusterId: cluster.clusterId,
    canonicalHeadline: cluster.canonicalHeadline,
    summary: cluster.summary,
    primaryCategory: cluster.primaryCategory,
    publishers: cluster.publishers || [],
    stories,
    primarySources,
    matchedScouts: cluster.matchedScouts || [],
    scoutSignals: cluster.matchedSignals || [],
    verificationStatus: cluster.verificationResult?.verificationStatus || 'UNASSESSED',
    verificationReasons: cluster.verificationResult?.verificationReasons || []
  };
}
