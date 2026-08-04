import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { generateAllAnalysisReports } from '@/lib/analysis/analysisEngine';
import { NewsCategory } from '@/lib/news/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category') as NewsCategory | null;
    const forceRefresh = searchParams.get('refresh') === 'true';

    // 1. Fetch real Phase 2 news
    const ingestion = await ingestNews({ forceRefresh });

    // 2. Perform deterministic story clustering (Phase 4)
    const { clusters, telemetry: clusterTelemetry } = clusterStories(ingestion.stories);

    // 3. Perform deterministic Verification & Evidence Graph building (Phase 5)
    const { verifiedClusters, telemetry: verificationTelemetry } = verifyAllClusters(clusters);

    // 4. Perform evidence-grounded AI Intelligence Analysis (Phase 6)
    const { enrichedClusters } = await generateAllAnalysisReports(verifiedClusters);

    let filteredClusters = enrichedClusters;
    if (categoryParam) {
      filteredClusters = enrichedClusters.filter((c) => c.primaryCategory === categoryParam);
    }

    return NextResponse.json({
      totalClusters: filteredClusters.length,
      clusters: filteredClusters,
      telemetry: clusterTelemetry,
      verificationTelemetry
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown event API error';
    console.error('[API Error] GET /api/events failed:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve verified event clusters.', details: errorMsg },
      { status: 500 }
    );
  }
}
