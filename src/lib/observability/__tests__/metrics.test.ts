import { describe, it, expect, beforeEach } from 'vitest';
import { metricsRegistry } from '../metrics';

describe('Application Metrics Registry', () => {

  beforeEach(() => {
    metricsRegistry.reset();
  });

  it('increments request counters and records stories and latency', () => {
    metricsRegistry.incrementRequest('/api/v1/events');
    metricsRegistry.recordStoriesIngested(25);
    metricsRegistry.observeLatency(100);

    const snapshot = metricsRegistry.getSnapshot();
    expect(snapshot.totalRequests).toBe(1);
    expect(snapshot.apiUsageByRoute['/api/v1/events']).toBe(1);
    expect(snapshot.storiesIngested).toBe(25);
    expect(snapshot.averageResponseLatencyMs).toBe(100);
  });

});
