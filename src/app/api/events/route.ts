import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const category = searchParams.get('category');
    const minSimilarity = parseInt(searchParams.get('minSimilarity') || '50', 10);

    // 1. Ingest real Phase 2 news
    const ingestion = await ingestNews({ forceRefresh });

    // 2. Perform deterministic story clustering
    const { clusters, telemetry } = clusterStories(ingestion.stories, {
      minSimilarityThreshold: minSimilarity
    });

    // 3. Optional category filter
    const filteredClusters = category && category !== 'ALL'
      ? clusters.filter(c => c.primaryCategory === category)
      : clusters;

    return NextResponse.json({
      clusters: filteredClusters,
      totalClusters: filteredClusters.length,
      telemetry,
      retrievedAt: new Date().toISOString()
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown event clustering error';
    console.error('[API Error] GET /api/events failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate event clusters.', details: errorMsg },
      { status: 500 }
    );
  }
}
