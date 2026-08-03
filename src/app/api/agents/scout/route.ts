import { NextRequest, NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
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

    // 3. Perform deterministic Verification & Evidence Graph building (Phase 5)
    const { verifiedClusters, telemetry: verificationTelemetry } = verifyAllClusters(clusters);

    // 4. Execute Scout Orchestrator concurrently over verified EventClusters (Phase 3)
    const { executionResult, enrichedClusters } = await runScoutOrchestratorForClusters(verifiedClusters, {
      minCandidateScore: minScore
    });

    // 5. Record runtime telemetry and generate real activity logs
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
      verificationTelemetry,
      activityLogs
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown orchestrator error';
    console.error('[API Error] POST /api/agents/scout failed:', error);
    return NextResponse.json(
      { error: 'Failed to execute Scout Orchestrator on verified event clusters.', details: errorMsg },
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
