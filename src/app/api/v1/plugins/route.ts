import { NextRequest, NextResponse } from 'next/server';
import { getPlugins, registerPlugin, togglePluginStatus } from '@/lib/platform/pluginRegistry';

export async function GET() {
  const plugins = getPlugins();
  return NextResponse.json({
    totalCount: plugins.length,
    plugins
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.togglePluginId !== undefined && body.enabled !== undefined) {
      const updated = togglePluginStatus(body.togglePluginId, body.enabled);
      return NextResponse.json({ plugin: updated }, { status: 200 });
    }

    const registered = registerPlugin(body.manifest);
    return NextResponse.json({ plugin: registered }, { status: 201 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown plugins v1 API error';
    return NextResponse.json(
      { error: 'Failed to process plugin request.', details: errorMsg },
      { status: 500 }
    );
  }
}
