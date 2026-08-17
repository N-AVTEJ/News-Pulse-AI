import { describe, it, expect, vi } from 'vitest';
import { eventBus } from '../eventBus';

describe('Internal Event Bus', () => {

  it('publishes events and invokes subscribers correctly', () => {
    const callback = vi.fn();
    const unsubscribe = eventBus.subscribe('EventClusterCreated', callback);

    eventBus.publish('EventClusterCreated', { clusterId: 'c100' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      topic: 'EventClusterCreated',
      payload: { clusterId: 'c100' }
    }));

    unsubscribe();
  });

});
