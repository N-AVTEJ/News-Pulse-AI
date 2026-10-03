import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';
import { QualityGateResult, QualityGateDecision } from '../types';
import { evaluateGrounding } from './groundingEvaluator';
import { evaluateCitations } from './citationEvaluator';
import { evaluateClaims } from './claimEvaluator';

export function evaluateReportQualityGate(
  cluster: EventCluster,
  report?: AnalysisReport
): QualityGateResult {
  const grounding = evaluateGrounding(cluster, report);
  const citations = evaluateCitations(cluster, report);
  const claims = evaluateClaims(cluster, report);

  // Overall Score calculation:
  // 45% Grounding + 35% Claims + 20% Citations
  const overallScore = Math.round(
    grounding.score * 0.45 + claims.score * 0.35 + citations.score * 0.20
  );

  const reasons: string[] = [];
  let decision: QualityGateDecision = 'PUBLISH';

  // Strict Evaluation Rules:
  // 1. Hallucinated citations are unacceptable
  if (citations.invalidCitationsCount > 0) {
    reasons.push(`Detected ${citations.invalidCitationsCount} ungrounded/hallucinated citation source(s)`);
    decision = 'FLAG_FOR_REVIEW';
  }

  // 2. Unsupported claims check
  if (claims.unsupportedClaims.length > 1) {
    reasons.push(`${claims.unsupportedClaims.length} unsupported factual claims detected in summary`);
    decision = 'FLAG_FOR_REVIEW';
  }

  // 3. Overall composite thresholds
  if (overallScore < 50) {
    decision = 'REJECT';
    reasons.push(`Overall quality score (${overallScore}) failed minimum publication threshold (50)`);
  } else if (overallScore < 70 && decision === 'PUBLISH') {
    decision = 'FLAG_FOR_REVIEW';
    reasons.push(`Moderate quality score (${overallScore}) requires human analyst review`);
  }

  if (reasons.length === 0) {
    reasons.push('Intelligence report verified with high grounding fidelity and valid source citations');
  }

  const passed = decision === 'PUBLISH';

  return {
    clusterId: cluster.clusterId,
    passed,
    decision,
    overallScore,
    grounding,
    citations,
    claims,
    reasons,
    evaluatedAt: new Date().toISOString()
  };
}
