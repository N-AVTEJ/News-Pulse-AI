import { NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { getActiveWorkspace, getUserProfile } from '@/lib/personalization/profile';
import { generatePersonalFeed } from '@/lib/personalization/feedEngine';

export async function GET() {
  try {
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);

    const profile = getUserProfile();
    const workspace = getActiveWorkspace();

    const rankedFeed = generatePersonalFeed(verifiedClusters, profile, workspace);

    return NextResponse.json({
      totalCount: rankedFeed.length,
      workspaceName: workspace.name,
      feed: rankedFeed
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown feed API error';
    return NextResponse.json(
      { error: 'Failed to generate personal feed.', details: errorMsg },
      { status: 500 }
    );
  }
}
