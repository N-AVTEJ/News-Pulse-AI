import { EventCluster } from '../clustering/types';
import { buildEvidenceGraph } from './evidenceGraph';
import { evaluateVerificationRules } from './rules';
import { EvidenceGraph, VerificationResult, VerificationStatus, VerificationTelemetry } from './types';

/**
 * Verifies a single EventCluster deterministically and builds its Evidence Graph.
 */
export function verifyCluster(cluster: EventCluster): {
  verification: VerificationResult;
  evidenceGraph: EvidenceGraph;
} {
  const verification = evaluateVerificationRules(cluster);
  const evidenceGraph = buildEvidenceGraph(cluster, verification);
  return { verification, evidenceGraph };
}

/**
 * Evaluates all EventClusters in batch and produces verification telemetry.
 */
export function verifyAllClusters(clusters: EventCluster[]): {
  verifiedClusters: EventCluster[];
  telemetry: VerificationTelemetry;
} {
  const startTime = Date.now();
  const statusDistribution: Record<VerificationStatus, number> = {
    UNASSESSED: 0,
    PENDING: 0,
    LIMITED_CORROBORATION: 0,
    STRONG_CORROBORATION: 0,
    CONFLICTING_REPORTS: 0,
    INSUFFICIENT_EVIDENCE: 0
  };

  let conflictsDetectedCount = 0;
  let totalEvidenceStories = 0;

  const verifiedClusters: EventCluster[] = clusters.map((cluster) => {
    const { verification, evidenceGraph } = verifyCluster(cluster);

    statusDistribution[verification.verificationStatus] = (statusDistribution[verification.verificationStatus] || 0) + 1;
    if (verification.verificationStatus === 'CONFLICTING_REPORTS') {
      conflictsDetectedCount++;
    }
    totalEvidenceStories += verification.evidenceCount;

    return {
      ...cluster,
      verificationResult: verification,
      evidenceGraph
    };
  });

  const durationMs = Date.now() - startTime;
  const telemetry: VerificationTelemetry = {
    totalClustersVerified: clusters.length,
    statusDistribution,
    conflictsDetectedCount,
    averageEvidenceCount: clusters.length > 0 ? parseFloat((totalEvidenceStories / clusters.length).toFixed(1)) : 0,
    durationMs
  };

  console.log(`[VerificationLog] [COMPLETE] Verified ${clusters.length} EventClusters (${statusDistribution.STRONG_CORROBORATION} strong, ${statusDistribution.LIMITED_CORROBORATION} limited, ${conflictsDetectedCount} conflicts) in ${durationMs}ms`);

  return { verifiedClusters, telemetry };
}
