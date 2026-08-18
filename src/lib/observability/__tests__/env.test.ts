import { describe, it, expect } from 'vitest';
import { validateEnv } from '../env';

describe('Environment Configuration Validator', () => {

  it('validates default runtime configuration with fallback values', () => {
    const config = validateEnv();
    expect(config).toBeDefined();
    expect(config.nodeEnv).toBeDefined();
    expect(config.port).toBeGreaterThan(0);
    expect(config.rateLimitPerMinute).toBeGreaterThan(0);
  });

});
