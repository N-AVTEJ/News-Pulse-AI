import { describe, it, expect } from 'vitest';
import { logger } from '../logger';

describe('Structured JSON Logger', () => {

  it('generates structured log entries and redacts sensitive tokens', () => {
    const entry = logger.info('Test Event', {
      requestId: 'req_test_123',
      metadata: {
        normalField: 'testValue',
        apiKey: 'secret_live_key_98234',
        userPassword: 'myPlaintextPassword'
      }
    });

    expect(entry.event).toBe('Test Event');
    expect(entry.level).toBe('info');
    expect(entry.metadata?.normalField).toBe('testValue');
    expect(entry.metadata?.apiKey).toBe('[REDACTED]');
    expect(entry.metadata?.userPassword).toBe('[REDACTED]');
  });

});
