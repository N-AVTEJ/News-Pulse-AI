import { NextRequest, NextResponse } from 'next/server';
import { evaluateReportQualityGate } from '@/lib/ai/evaluation/qualityGate';
import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cluster: EventCluster = body.cluster;
    const report: AnalysisReport = body.report;

    if (!cluster) {
      return NextResponse.json({ error: 'Missing cluster payload' }, { status: 400 });
    }

    const evaluation = evaluateReportQualityGate(cluster, report);

    return NextResponse.json({
      evaluation,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown evaluation error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
