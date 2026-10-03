import { NextResponse } from 'next/server';
import { getModelTelemetry } from '@/lib/ai/telemetry';
import { computeEvaluationMetrics } from '@/lib/ai/metrics';
import { getRegressionBenchmarks } from '@/lib/ai/evaluation/regression';

export async function GET() {
  const telemetry = getModelTelemetry();
  const regressions = getRegressionBenchmarks();

  // Synthetic sample history for initialization
  const sampleHistory = [
    { overallScore: 88, groundingScore: 89, citationScore: 92, claimScore: 85, passed: true, decision: 'PUBLISH' },
    { overallScore: 82, groundingScore: 80, citationScore: 85, claimScore: 80, passed: true, decision: 'PUBLISH' },
    { overallScore: 68, groundingScore: 65, citationScore: 60, claimScore: 72, passed: false, decision: 'FLAG_FOR_REVIEW' },
    { overallScore: 91, groundingScore: 93, citationScore: 95, claimScore: 88, passed: true, decision: 'PUBLISH' }
  ];

  const metrics = computeEvaluationMetrics(sampleHistory);

  return NextResponse.json({
    metrics,
    telemetry: telemetry.slice(0, 20),
    regressions,
    timestamp: new Date().toISOString()
  });
}
