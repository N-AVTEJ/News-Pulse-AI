import { describe, it, expect, beforeEach } from 'vitest';
import { reliableQueue } from '../../runtime/queueReliability';

describe('Hardened Queue Reliability', () => {

  beforeEach(() => {
    reliableQueue.clearQueue();
  });

  it('prevents duplicate jobs with identical idempotency keys', () => {
    const job1 = reliableQueue.enqueue('TEST_JOB', { data: 1 }, 'idemp_key_001');
    const job2 = reliableQueue.enqueue('TEST_JOB', { data: 1 }, 'idemp_key_001');

    expect(job1.id).toBe(job2.id);
  });

  it('transitions failed job to dead-letter state when exceeding max retries', () => {
    const job = reliableQueue.enqueue('FAIL_JOB', {}, 'idemp_key_fail', 2);

    reliableQueue.handleFailure(job.id, 'Attempt 1 failed');
    expect(job.status).toBe('RETRYING');
    expect(job.attempts).toBe(1);

    reliableQueue.handleFailure(job.id, 'Attempt 2 failed');
    expect(job.status).toBe('DEAD_LETTER');
    expect(job.attempts).toBe(2);

    const deadLetters = reliableQueue.getDeadLetterJobs();
    expect(deadLetters).toHaveLength(1);
    expect(deadLetters[0].id).toBe(job.id);
  });

});
