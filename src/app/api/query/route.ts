import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { generateAllAnalysisReports } from '@/lib/analysis/analysisEngine';
import { evaluateAllBreakingEvents } from '@/lib/runtime/breakingDetector';
import { parseNaturalLanguageQuery } from '@/lib/knowledge/queryEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const queryText = body.query || '';

    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);
    const { enrichedClusters } = await generateAllAnalysisReports(verifiedClusters);
    const breakingClusters = evaluateAllBreakingEvents(enrichedClusters);

    const result = parseNaturalLanguageQuery(queryText, breakingClusters);

    const matchedClusters = breakingClusters.filter(c => result.matchedClusterIds.includes(c.clusterId));

    return NextResponse.json({
      query: result.rawQuery,
      filter: result.filter,
      explanation: result.explanation,
      matchedClustersCount: matchedClusters.length,
      matchedClusters
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown query API error';
    return NextResponse.json(
      { error: 'Failed to process natural language query.', details: errorMsg },
      { status: 500 }
    );
  }
}
