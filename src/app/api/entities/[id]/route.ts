import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { generateAllAnalysisReports } from '@/lib/analysis/analysisEngine';
import { buildKnowledgeGraphFromClusters } from '@/lib/knowledge/relationshipBuilder';
import { graphStore } from '@/lib/knowledge/graph';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);
    const { enrichedClusters } = await generateAllAnalysisReports(verifiedClusters);

    buildKnowledgeGraphFromClusters(enrichedClusters);

    const node = graphStore.getNode(id);
    if (!node) {
      return NextResponse.json({ error: `Entity node '${id}' not found.` }, { status: 404 });
    }

    const neighbors = graphStore.getNeighbors(id);

    const relatedClusters = enrichedClusters.filter(c => 
      c.canonicalHeadline.toLowerCase().includes(node.canonicalName.toLowerCase()) ||
      (c.analysisReport?.entities || []).some(e => e.name.toLowerCase() === node.canonicalName.toLowerCase())
    );

    return NextResponse.json({
      node,
      neighborsCount: neighbors.length,
      neighbors,
      relatedClustersCount: relatedClusters.length,
      relatedClusters
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown entity detail API error';
    return NextResponse.json(
      { error: 'Failed to fetch entity details.', details: errorMsg },
      { status: 500 }
    );
  }
}
