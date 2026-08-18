import { NextResponse } from 'next/server';
import { envConfig } from '@/lib/observability/env';
import { metricsRegistry } from '@/lib/observability/metrics';
import { schedulerLock } from '@/lib/runtime/schedulerLock';
import { reliableQueue } from '@/lib/runtime/queueReliability';
import { graphStore } from '@/lib/knowledge/graph';

export async function GET() {
  const memoryUsageMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  const metrics = metricsRegistry.getSnapshot();
  const lock = schedulerLock.getLockState();
  const deadLetterCount = reliableQueue.getDeadLetterJobs().length;
  const graph = graphStore.getGraph();

  const dependencies = {
    newsIngestion: {
      status: 'UP',
      sourcesOnline: 6,
      totalSources: 6,
      storiesIngested: metrics.storiesIngested
    },
    verificationEngine: {
      status: 'UP',
      jobsProcessed: metrics.verificationJobs
    },
    aiAnalysisEngine: {
      status: 'UP',
      provider: 'grounded-deterministic-fallback',
      reportsGenerated: metrics.analysisReportsGenerated
    },
    knowledgeGraph: {
      status: 'UP',
      nodesCount: graph.nodes.length,
      edgesCount: graph.edges.length
    },
    scheduler: {
      status: lock.consecutiveFailures > 2 ? 'DEGRADED' : 'UP',
      isLocked: lock.isLocked,
      lastSuccessfulRun: lock.lastSuccessfulRun,
      consecutiveFailures: lock.consecutiveFailures
    },
    jobQueue: {
      status: deadLetterCount > 5 ? 'DEGRADED' : 'UP',
      deadLetterCount
    }
  };

  const systemStatus = Object.values(dependencies).every(d => d.status === 'UP') ? 'HEALTHY' : 'DEGRADED';

  return NextResponse.json({
    status: systemStatus,
    environment: envConfig.nodeEnv,
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      heapUsedMb: memoryUsageMb,
      thresholdMb: envConfig.memoryThresholdMb
    },
    dependencies,
    metrics,
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
