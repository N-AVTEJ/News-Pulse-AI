import { NextRequest, NextResponse } from 'next/server';
import { getActiveWorkspace } from '@/lib/personalization/profile';
import { Watchlist } from '@/lib/personalization/types';

export async function GET() {
  const workspace = getActiveWorkspace();
  return NextResponse.json({
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    watchlists: workspace.watchlists || []
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workspace = getActiveWorkspace();

    const newWatchlist: Watchlist = {
      id: `wl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: body.name || 'New Custom Watchlist',
      description: body.description || 'Custom intelligence watchlist',
      rules: {
        keywords: body.keywords || [],
        companies: body.companies || [],
        products: body.products || [],
        people: body.people || [],
        organizations: body.organizations || [],
        locations: body.locations || [],
        technologies: body.technologies || [],
        excludeKeywords: body.excludeKeywords || [],
        priority: body.priority || 'HIGH'
      },
      createdAt: new Date().toISOString()
    };

    workspace.watchlists = workspace.watchlists || [];
    workspace.watchlists.unshift(newWatchlist);

    return NextResponse.json({
      watchlist: newWatchlist,
      watchlists: workspace.watchlists
    }, { status: 201 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown watchlists API error';
    return NextResponse.json(
      { error: 'Failed to create watchlist.', details: errorMsg },
      { status: 500 }
    );
  }
}
