import { EventCluster } from '@/lib/clustering/types';
import { Contradiction, EvidenceGap, ResearchFinding } from './types';

export interface UncertaintyAnalysisResult {
  contradictions: Contradiction[];
  evidenceGaps: EvidenceGap[];
  unresolvedQuestions: string[];
}

/**
 * Analyzes evidence corpus and research findings to identify contradictions, single-source dependencies,
 * outdated reporting, and missing primary evidence without silently resolving conflicts.
 */
export function analyzeUncertaintiesAndGaps(
  findings: ResearchFinding[],
  clusters: EventCluster[]
): UncertaintyAnalysisResult {
  const contradictions: Contradiction[] = [];
  const evidenceGaps: EvidenceGap[] = [];
  const unresolvedQuestions: string[] = [];

  // 1. Identify Contradictions across findings and verification results
  for (const cluster of clusters) {
    if (cluster.verificationResult?.conflictDetected) {
      contradictions.push({
        id: `contra_${cluster.clusterId}`,
        topic: cluster.canonicalHeadline,
        claimA: `Initial report: ${cluster.summary}`,
        claimB: `Conflicting reporting noted across publishers (${cluster.publishers.join(', ')})`,
        supportingSourcesA: [cluster.publishers[0] || 'Unknown Source'],
        supportingSourcesB: cluster.publishers.slice(1),
        severity: cluster.verificationResult.verificationStatus === 'UNVERIFIED_CONFLICT' ? 'HIGH' : 'MEDIUM',
        resolutionStatus: 'PERSISTENT_CONFLICT',
        explanation: 'Multiple news outlets published differing accounts or conflicting quantitative figures.'
      });
    }

    // Single-source syndication dependency check:
    // If a cluster has multiple articles but low source diversity score or only 1 primary publisher
    if (cluster.publishers.length === 1 && cluster.stories.length > 2) {
      evidenceGaps.push({
        id: `gap_syndication_${cluster.clusterId}`,
        description: `Cluster "${cluster.canonicalHeadline.slice(0, 50)}..." consists of multiple articles from a single outlet (${cluster.publishers[0]}), lacking independent corroboration.`,
        gapType: 'INSUFFICIENT_DIVERSITY',
        suggestedAction: 'Seek secondary verification from independent reporting outlets.'
      });
    }

    // Missing primary evidence check
    if (cluster.verificationResult && cluster.verificationResult.primarySourceCount === 0) {
      evidenceGaps.push({
        id: `gap_primary_${cluster.clusterId}`,
        description: `No direct primary source (e.g. official announcement, regulatory filing) identified for "${cluster.canonicalHeadline.slice(0, 50)}...".`,
        gapType: 'MISSING_PRIMARY',
        suggestedAction: 'Monitor official corporate, government, or regulatory press releases.'
      });
    }

    // Outdated evidence check (> 14 days old)
    if (cluster.latestPublished) {
      const ageDays = (Date.now() - new Date(cluster.latestPublished).getTime()) / (1000 * 3600 * 24);
      if (ageDays > 14) {
        evidenceGaps.push({
          id: `gap_outdated_${cluster.clusterId}`,
          description: `Latest available evidence for "${cluster.canonicalHeadline.slice(0, 50)}..." is ${Math.round(ageDays)} days old.`,
          gapType: 'OUTDATED_EVIDENCE',
          suggestedAction: 'Refresh live RSS feeds to detect subsequent developments.'
        });
      }
    }
  }

  // 2. Finding-level contradiction checks
  for (const finding of findings) {
    if (finding.contradictingCitations && finding.contradictingCitations.length > 0) {
      contradictions.push({
        id: `contra_finding_${finding.id}`,
        topic: finding.claim,
        claimA: finding.claim,
        claimB: `Contradicting statement in: ${finding.contradictingCitations[0].headline}`,
        supportingSourcesA: finding.supportingCitations.map(c => c.publisherName),
        supportingSourcesB: finding.contradictingCitations.map(c => c.publisherName),
        severity: 'HIGH',
        resolutionStatus: 'UNRESOLVED',
        explanation: 'Conflicting claims identified directly between retrieved source articles.'
      });
    }

    if (finding.confidenceScore < 60) {
      unresolvedQuestions.push(
        `Is the assertion regarding "${finding.claim.slice(0, 60)}..." corroborated by direct primary documentation?`
      );
    }
  }

  if (unresolvedQuestions.length === 0) {
    unresolvedQuestions.push('What subsequent commercial, legal, or policy actions will key stakeholders execute?');
  }

  return {
    contradictions,
    evidenceGaps,
    unresolvedQuestions
  };
}
