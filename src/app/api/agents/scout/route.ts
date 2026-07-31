import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { runScoutOrchestratorForClusters } from '@/lib/agents/orchestrator';
import { getLatestExecution, recordExecutionResult } from '@/lib/agents/telemetry/executionTracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const minScore = typeof body.minScore === 'number' ? body.minScore : 40;
    const forceRefresh = body.refresh === true;

    // 1. Fetch real Phase 2 news
    const ingestion = await ingestNews({ forceRefresh });

    // 2. Perform deterministic story clustering (Phase 4)
    const { clusters, telemetry: clusterTelemetry } = clusterStories(ingestion.stories);

    // 3. Execute Scout Orchestrator concurrently over EventClusters
    const { executionResult, enrichedClusters } = await runScoutOrchestratorForClusters(clusters, {
      minCandidateScore: minScore
    });

    // 4. Record runtime telemetry and generate real activity logs
    const activityLogs = recordExecutionResult(executionResult);

    return NextResponse.json({
      executionId: executionResult.executionId,
      status: executionResult.status,
      startedAt: executionResult.startedAt,
      completedAt: executionResult.completedAt,
      durationMs: executionResult.durationMs,
      totalStoriesProcessed: executionResult.totalStoriesProcessed,
      totalSelected: executionResult.totalSelected,
      agentTelemetry: executionResult.agentTelemetry,
      intelligence: executionResult.intelligence,
      eventClusters: enrichedClusters,
      clusterTelemetry,
      activityLogs
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown orchestrator error';
    console.error('[API Error] POST /api/agents/scout failed:', error);
    return NextResponse.json(
      { error: 'Failed to execute Scout Orchestrator on event clusters.', details: errorMsg },
      { status: 500 }
    );
  }
}

export async function GET() {
  const latest = getLatestExecution();
  return NextResponse.json({
    latestExecution: latest || null
  }, { status: 200 });
}
