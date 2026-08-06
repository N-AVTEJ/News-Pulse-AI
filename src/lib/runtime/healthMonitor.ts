import { jobQueue } from './jobQueue';
import { workerPool } from './worker';
import { HealthMetrics } from './types';

let totalRunsCompleted = 0;
let totalExecutionTimeMs = 0;
let lastSuccessfulRun: string | null = null;
let failedJobsCount = 0;
let schedulerActive = true;
let schedulerMode: 'MANUAL' | 'INTERVAL' | 'DEV' | 'PROD' = 'MANUAL';

export function recordRunCompletion(durationMs: number, success: boolean): void {
  totalRunsCompleted++;
  totalExecutionTimeMs += durationMs;
  if (success) {
    lastSuccessfulRun = new Date().toISOString();
  }
}

export function recordJobFailure(): void {
  failedJobsCount++;
}

export function setSchedulerState(active: boolean, mode: 'MANUAL' | 'INTERVAL' | 'DEV' | 'PROD'): void {
  schedulerActive = active;
  schedulerMode = mode;
}

export function getHealthMetrics(): HealthMetrics {
  const queue = jobQueue.getQueue();
  const queueLength = queue.filter(j => j.status === 'QUEUED').length;

  return {
    schedulerActive,
    schedulerMode,
    workersActive: workerPool.getActiveWorkerCount(),
    queueLength,
    lastSuccessfulRun,
    averageExecutionTimeMs: totalRunsCompleted > 0 ? Math.round(totalExecutionTimeMs / totalRunsCompleted) : 0,
    sourceAvailabilityPercentage: 100.0,
    failedJobsCount,
    totalRunsCompleted
  };
}
