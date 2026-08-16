import { NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { generateAllAnalysisReports } from '@/lib/analysis/analysisEngine';
import { buildKnowledgeGraphFromClusters } from '@/lib/knowledge/relationshipBuilder';

export async function GET() {
  try {
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);
    const { enrichedClusters } = await generateAllAnalysisReports(verifiedClusters);

    const graph = buildKnowledgeGraphFromClusters(enrichedClusters);

    return NextResponse.json({
      totalCount: graph.edges.length,
      relationships: graph.edges
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown relationships API error';
    return NextResponse.json(
      { error: 'Failed to fetch relationships.', details: errorMsg },
      { status: 500 }
    );
  }
}
