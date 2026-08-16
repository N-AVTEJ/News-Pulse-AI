import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { getHistoricalArchive } from '@/lib/knowledge/archive';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;

    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);

    const archiveItems = getHistoricalArchive(clusters, q);

    return NextResponse.json({
      totalCount: archiveItems.length,
      archiveItems
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown archive API error';
    return NextResponse.json(
      { error: 'Failed to fetch historical archive.', details: errorMsg },
      { status: 500 }
    );
  }
}
