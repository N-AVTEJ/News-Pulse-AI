import { jobQueue } from './jobQueue';
import { PipelineJob, PipelineStage } from './types';

export class WorkerPool {
  private activeWorkers = 0;
  private maxConcurrency = 3;
  private activeStages = new Set<PipelineStage>();

  getActiveWorkerCount(): number {
    return this.activeWorkers;
  }

  isStageActive(stage: PipelineStage): boolean {
    return this.activeStages.has(stage);
  }

  async executeJobStage<T>(
    stage: PipelineStage,
    taskFn: () => Promise<T>
  ): Promise<{ job: PipelineJob; result: T }> {
    if (this.isStageActive(stage)) {
      throw new Error(`Stage ${stage} is already running in active worker.`);
    }

    const job = jobQueue.enqueueJob(stage);
    this.activeWorkers++;
    this.activeStages.add(stage);
    jobQueue.updateJobStatus(job.id, 'RUNNING');

    try {
      const result = await taskFn();
      const completedJob = jobQueue.updateJobStatus(job.id, 'COMPLETED', { success: true });
      return { job: completedJob, result };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Worker execution failure';
      const failedJob = jobQueue.updateJobStatus(job.id, 'FAILED', undefined, errorMsg);
      throw { job: failedJob, error: errorMsg };
    } finally {
      this.activeWorkers = Math.max(0, this.activeWorkers - 1);
      this.activeStages.delete(stage);
    }
  }
}

export const workerPool = new WorkerPool();
