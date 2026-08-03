import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyCluster } from '@/lib/verification/engine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  try {
    const { clusterId } = await params;
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

    return NextResponse.json({
      clusterId: cluster.clusterId,
      canonicalHeadline: cluster.canonicalHeadline,
      verification,
      evidenceGraph,
      supportingSources: verification.supportingSources,
      reasons: verification.verificationReasons,
      timeline: cluster.stories
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown verification API error';
    return NextResponse.json(
      { error: 'Failed to retrieve cluster verification result.', details: errorMsg },
      { status: 500 }
    );
  }
}
