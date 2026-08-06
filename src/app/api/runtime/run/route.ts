import { NextRequest, NextResponse } from 'next/server';
import { executeAutonomousPipeline } from '@/lib/runtime/pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const forceRefresh = body.refresh === true;

    const { run, clusters, notifications } = await executeAutonomousPipeline('MANUAL', { forceRefresh });

    return NextResponse.json({
      runId: run.runId,
      status: run.status,
      durationMs: run.durationMs,
      newStoriesCount: run.newStoriesCount,
      updatedClustersCount: run.updatedClustersCount,
      notificationsGeneratedCount: notifications.length,
      run,
      clustersCount: clusters.length,
      notifications
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown runtime pipeline error';
    return NextResponse.json(
      { error: 'Failed to execute autonomous pipeline.', details: errorMsg },
      { status: 500 }
    );
  }
}
