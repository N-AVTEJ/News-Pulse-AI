import { NextResponse } from 'next/server';
import { getSchedulerStatus } from '@/lib/runtime/scheduler';
import { workerPool } from '@/lib/runtime/worker';
import { jobQueue } from '@/lib/runtime/jobQueue';
import { getHealthMetrics } from '@/lib/runtime/healthMonitor';

export async function GET() {
  const scheduler = getSchedulerStatus();
  const activeWorkers = workerPool.getActiveWorkerCount();
  const queue = jobQueue.getQueue();
  const health = getHealthMetrics();

  return NextResponse.json({
    scheduler,
    activeWorkers,
    queueLength: queue.filter(j => j.status === 'QUEUED').length,
    activeJobs: queue.filter(j => j.status === 'RUNNING'),
    health
  }, { status: 200 });
}
