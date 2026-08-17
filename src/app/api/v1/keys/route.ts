import { NextRequest, NextResponse } from 'next/server';
import { createApiKey, getApiKeys } from '@/lib/platform/api/auth';

export async function GET() {
  const keys = getApiKeys();
  return NextResponse.json({
    totalCount: keys.length,
    keys
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const created = createApiKey(
      body.name || 'Developer API Key',
      body.ownerId || 'mem_analyst_01',
      body.scopes || ['read:events', 'write:workflows']
    );

    return NextResponse.json({ apiKey: created }, { status: 201 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown API keys route error';
    return NextResponse.json(
      { error: 'Failed to generate API key.', details: errorMsg },
      { status: 500 }
    );
  }
}
