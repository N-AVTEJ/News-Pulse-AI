import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { NewsCategory } from '@/lib/news/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse parameters
    const categoryParam = searchParams.get('category') as NewsCategory | null;
    const sourceParam = searchParams.get('source');
    const limitParam = searchParams.get('limit');
    const refreshParam = searchParams.get('refresh');

    // Validate category parameter if present
    const validCategories: NewsCategory[] = ['ai-tech', 'business', 'world'];
    const category = categoryParam && validCategories.includes(categoryParam) ? categoryParam : undefined;

    // Parse limit
    let limit = limitParam ? parseInt(limitParam, 10) : undefined;
    if (limit && (isNaN(limit) || limit <= 0)) {
      limit = undefined;
    }

    const forceRefresh = refreshParam === 'true' || refreshParam === '1';

    // Ingest news
    const data = await ingestNews({
      category,
      sourceId: sourceParam || undefined,
      forceRefresh
    });

    // Apply limit if requested
    const slicedStories = limit ? data.stories.slice(0, limit) : data.stories;

    return NextResponse.json({
      stories: slicedStories,
      total: data.stories.length,
      retrievedAt: data.retrievedAt,
      sourceStatus: data.sourceStatus
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('[API Error] GET /api/news failed:', error);
    return NextResponse.json(
      { error: 'Failed to ingest real news feeds.', details: error.message },
      { status: 500 }
    );
  }
}
