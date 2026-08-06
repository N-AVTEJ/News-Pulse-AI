import { describe, it, expect } from 'vitest';
import { executeAutonomousPipeline } from '../pipeline';

describe('Autonomous Pipeline Orchestrator', () => {

  it('executes full autonomous pipeline across Stages 1–8 successfully', async () => {
    const { run, clusters, notifications } = await executeAutonomousPipeline('DEV_MODE', { forceRefresh: true });

    expect(run.runId).toBeDefined();
    expect(run.status).toBe('SUCCESS');
    expect(run.jobs.length).toBe(8); // Stages 1 to 8 executed
    expect(clusters.length).toBeGreaterThan(0);
    expect(Array.isArray(notifications)).toBe(true);
  });

});
