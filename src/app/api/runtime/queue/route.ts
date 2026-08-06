import { NextResponse } from 'next/server';
import { jobQueue } from '@/lib/runtime/jobQueue';

export async function GET() {
  const queue = jobQueue.getQueue();
  return NextResponse.json({
    totalJobs: queue.length,
    queuedJobs: queue.filter(j => j.status === 'QUEUED'),
    runningJobs: queue.filter(j => j.status === 'RUNNING'),
    completedJobs: queue.filter(j => j.status === 'COMPLETED'),
    failedJobs: queue.filter(j => j.status === 'FAILED'),
    queue
  }, { status: 200 });
}
