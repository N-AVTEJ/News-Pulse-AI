import { NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { evaluateAllBreakingEvents } from '@/lib/runtime/breakingDetector';
import { getActiveWorkspace } from '@/lib/personalization/profile';
import { generatePersonalAlerts } from '@/lib/personalization/alertEngine';

export async function GET() {
  try {
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);
    const breakingClusters = evaluateAllBreakingEvents(verifiedClusters);

    const workspace = getActiveWorkspace();
    const alerts = generatePersonalAlerts(breakingClusters, workspace);

    return NextResponse.json({
      workspaceId: workspace.id,
      alertsCount: alerts.length,
      alerts
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown alerts API error';
    return NextResponse.json(
      { error: 'Failed to generate personal alerts.', details: errorMsg },
      { status: 500 }
    );
  }
}
