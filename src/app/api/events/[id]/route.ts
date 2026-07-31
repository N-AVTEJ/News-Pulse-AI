import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);

    const cluster = clusters.find((c) => c.clusterId === id || c.clusterId.includes(id));

    if (!cluster) {
      return NextResponse.json(
        { error: `Event cluster with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ cluster }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to retrieve event cluster details.', details: errorMsg },
      { status: 500 }
    );
  }
}
