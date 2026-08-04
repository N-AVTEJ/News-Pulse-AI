import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyCluster } from '@/lib/verification/engine';
import { generateAnalysisReport, getCachedAnalysisReport } from '@/lib/analysis/analysisEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  try {
    const { clusterId } = await params;

    // Check in-memory cache first
    const cached = getCachedAnalysisReport(clusterId);
    if (cached) {
      return NextResponse.json({
        clusterId,
        analysis: cached,
        citations: cached.citations,
        entities: cached.entities,
        relationships: cached.entityRelationships,
        uncertainties: cached.remainingUncertainty,
        impact: cached.potentialImpact,
        relatedEvents: cached.relatedEvents
      }, { status: 200 });
    }

    // Ingest & cluster to generate report if not in cache
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const cluster = clusters.find((c) => c.clusterId === clusterId || c.clusterId.includes(clusterId));

    if (!cluster) {
      return NextResponse.json(
        { error: `Event cluster with ID ${clusterId} not found.` },
        { status: 404 }
      );
    }

    const { verification, evidenceGraph } = verifyCluster(cluster);
    const verifiedCluster = { ...cluster, verificationResult: verification, evidenceGraph };

    const report = await generateAnalysisReport(verifiedCluster, clusters);

    return NextResponse.json({
      clusterId: cluster.clusterId,
      analysis: report,
      citations: report.citations,
      entities: report.entities,
      relationships: report.entityRelationships,
      uncertainties: report.remainingUncertainty,
      impact: report.potentialImpact,
      relatedEvents: report.relatedEvents
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown analysis API error';
    return NextResponse.json(
      { error: 'Failed to retrieve AI analysis report.', details: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  try {
    const { clusterId } = await params;
    const ingestion = await ingestNews({ forceRefresh: true });
    const { clusters } = clusterStories(ingestion.stories);
    const cluster = clusters.find((c) => c.clusterId === clusterId || c.clusterId.includes(clusterId));

    if (!cluster) {
      return NextResponse.json(
        { error: `Event cluster with ID ${clusterId} not found.` },
        { status: 404 }
      );
    }

    const { verification, evidenceGraph } = verifyCluster(cluster);
    const verifiedCluster = { ...cluster, verificationResult: verification, evidenceGraph };

    const report = await generateAnalysisReport(verifiedCluster, clusters);

    return NextResponse.json({
      clusterId: cluster.clusterId,
      analysis: report,
      citations: report.citations,
      entities: report.entities,
      relationships: report.entityRelationships,
      uncertainties: report.remainingUncertainty,
      impact: report.potentialImpact,
      relatedEvents: report.relatedEvents
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown analysis API error';
    return NextResponse.json(
      { error: 'Failed to generate AI analysis report.', details: errorMsg },
      { status: 500 }
    );
  }
}
