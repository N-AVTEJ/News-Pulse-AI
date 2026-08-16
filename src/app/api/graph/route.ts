import { NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { generateAllAnalysisReports } from '@/lib/analysis/analysisEngine';
import { buildKnowledgeGraphFromClusters } from '@/lib/knowledge/relationshipBuilder';
import { getExecutiveGraphAnalytics } from '@/lib/knowledge/analytics';

export async function GET() {
  try {
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);
    const { enrichedClusters } = await generateAllAnalysisReports(verifiedClusters);

    const graph = buildKnowledgeGraphFromClusters(enrichedClusters);
    const analytics = getExecutiveGraphAnalytics(enrichedClusters);

    return NextResponse.json({
      nodesCount: graph.nodes.length,
      edgesCount: graph.edges.length,
      graph,
      analytics
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown graph API error';
    return NextResponse.json(
      { error: 'Failed to build knowledge graph.', details: errorMsg },
      { status: 500 }
    );
  }
}
