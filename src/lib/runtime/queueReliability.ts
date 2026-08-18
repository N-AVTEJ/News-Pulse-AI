export type ReliableJobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'RETRYING' | 'DEAD_LETTER';

export interface ReliableJob {
  id: string;
  idempotencyKey: string;
  type: string;
  payload: Record<string, unknown>;
  status: ReliableJobStatus;
  attempts: number;
  maxRetries: number;
  nextRunAt: number;
  createdAt: string;
  lastError?: string;
}

class ReliableJobQueue {
  private jobs: Map<string, ReliableJob> = new Map();
  private processedKeys: Set<string> = new Set();

  enqueue(type: string, payload: Record<string, unknown>, idempotencyKey: string, maxRetries: number = 3): ReliableJob {
    if (this.processedKeys.has(idempotencyKey)) {
      // Find existing job if already enqueued
      const existing = Array.from(this.jobs.values()).find(j => j.idempotencyKey === idempotencyKey);
      if (existing) return existing;
    }

    const job: ReliableJob = {
      id: `rjob_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      idempotencyKey,
      type,
      payload,
      status: 'PENDING',
      attempts: 0,
      maxRetries,
      nextRunAt: Date.now(),
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job);
    this.processedKeys.add(idempotencyKey);
    return job;
  }

  handleFailure(jobId: string, errorMsg: string): ReliableJob {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`Job ${jobId} not found.`);

    job.attempts++;
    job.lastError = errorMsg;

    if (job.attempts >= job.maxRetries) {
      job.status = 'DEAD_LETTER';
    } else {
      job.status = 'RETRYING';
      // Exponential backoff: 2^attempts * 500ms
      const backoffMs = Math.pow(2, job.attempts) * 500;
      job.nextRunAt = Date.now() + backoffMs;
    }

    return job;
  }

  completeJob(jobId: string): ReliableJob {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`Job ${jobId} not found.`);
    job.status = 'COMPLETED';
    return job;
  }

  getJobs(statusFilter?: ReliableJobStatus): ReliableJob[] {
    const all = Array.from(this.jobs.values());
    if (statusFilter) {
      return all.filter(j => j.status === statusFilter);
    }
    return all;
  }

  getDeadLetterJobs(): ReliableJob[] {
    return this.getJobs('DEAD_LETTER');
  }

  clearQueue(): void {
    this.jobs.clear();
    this.processedKeys.clear();
  }
}

export const reliableQueue = new ReliableJobQueue();
