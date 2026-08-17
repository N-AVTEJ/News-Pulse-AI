import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { validateApiKey } from '@/lib/platform/api/auth';
import { checkRateLimit } from '@/lib/platform/api/rateLimiter';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token) {
    const { valid, apiKey, error } = validateApiKey(token, 'read:events');
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized', details: error }, { status: 401 });
    }
    const { allowed } = checkRateLimit(apiKey!.id, apiKey!.rateLimitPerMinute);
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }
  }

  try {
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);

    return NextResponse.json({
      apiVersion: 'v1',
      totalCount: verifiedClusters.length,
      events: verifiedClusters
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown events v1 API error';
    return NextResponse.json(
      { error: 'Failed to fetch events v1.', details: errorMsg },
      { status: 500 }
    );
  }
}
