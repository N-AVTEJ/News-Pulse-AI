import { EvaluationSummaryMetrics } from './types';
import { getModelTelemetry } from './telemetry';

export function computeEvaluationMetrics(
  history: Array<{ overallScore: number; groundingScore: number; citationScore: number; claimScore: number; passed: boolean; decision: string }>
): EvaluationSummaryMetrics {
  const telemetry = getModelTelemetry();
  const totalTokens = telemetry.reduce((sum, t) => sum + t.totalTokens, 0);
  const totalCost = telemetry.reduce((sum, t) => sum + t.costUsd, 0);
  const avgLatency = telemetry.length > 0
    ? Math.round(telemetry.reduce((sum, t) => sum + t.latencyMs, 0) / telemetry.length)
    : 0;

  const total = history.length;
  if (total === 0) {
    return {
      totalEvaluated: 0,
      publishRate: 0,
      reviewRate: 0,
      rejectRate: 0,
      avgGroundingScore: 0,
      avgCitationScore: 0,
      avgClaimScore: 0,
      avgLatencyMs: avgLatency,
      totalTokensUsed: totalTokens,
      totalCostUsd: Number(totalCost.toFixed(4))
    };
  }

  const published = history.filter(h => h.decision === 'PUBLISH').length;
  const review = history.filter(h => h.decision === 'FLAG_FOR_REVIEW').length;
  const rejected = history.filter(h => h.decision === 'REJECT').length;

  const avgGrounding = Math.round(history.reduce((sum, h) => sum + h.groundingScore, 0) / total);
  const avgCitation = Math.round(history.reduce((sum, h) => sum + h.citationScore, 0) / total);
  const avgClaim = Math.round(history.reduce((sum, h) => sum + h.claimScore, 0) / total);

  return {
    totalEvaluated: total,
    publishRate: Number(((published / total) * 100).toFixed(1)),
    reviewRate: Number(((review / total) * 100).toFixed(1)),
    rejectRate: Number(((rejected / total) * 100).toFixed(1)),
    avgGroundingScore: avgGrounding,
    avgCitationScore: avgCitation,
    avgClaimScore: avgClaim,
    avgLatencyMs: avgLatency,
    totalTokensUsed: totalTokens,
    totalCostUsd: Number(totalCost.toFixed(4))
  };
}
