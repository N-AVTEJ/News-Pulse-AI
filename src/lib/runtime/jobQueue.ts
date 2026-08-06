import { JobStatus, PipelineJob, PipelineStage } from './types';

class InternalJobQueue {
  private jobs: Map<string, PipelineJob> = new Map();

  enqueueJob(stage: PipelineStage): PipelineJob {
    const jobId = `job_${stage.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const job: PipelineJob = {
      id: jobId,
      stage,
      status: 'QUEUED'
    };

    this.jobs.set(jobId, job);
    return job;
  }

  updateJobStatus(
    jobId: string,
    status: JobStatus,
    resultData?: Record<string, unknown>,
    error?: string
  ): PipelineJob {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ID ${jobId} not found in queue.`);
    }

    const updated: PipelineJob = {
      ...job,
      status,
      ...(status === 'RUNNING' ? { startedAt: new Date().toISOString() } : {}),
      ...(status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED' ? {
        completedAt: new Date().toISOString(),
        durationMs: job.startedAt ? Date.now() - new Date(job.startedAt).getTime() : 0
      } : {}),
      ...(resultData ? { resultData } : {}),
      ...(error ? { error } : {})
    };

    this.jobs.set(jobId, updated);
    return updated;
  }

  getQueue(): PipelineJob[] {
    return Array.from(this.jobs.values());
  }

  getPendingJobs(): PipelineJob[] {
    return this.getQueue().filter(j => j.status === 'QUEUED');
  }

  clearQueue(): void {
    this.jobs.clear();
  }
}

export const jobQueue = new InternalJobQueue();
