import { describe, it, expect } from 'vitest';
import { validatePluginManifest } from '../pluginManifest';

describe('Plugin Manifest Validator', () => {

  it('validates compliant plugin manifests', () => {
    const manifest = {
      id: 'plugin_valid_01',
      name: 'Valid Test Plugin',
      version: '1.0.0',
      category: 'DATA_CONNECTOR',
      entryPoint: 'index.js',
      supportedPlatformVersion: '1.0.0'
    };

    const result = validatePluginManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects invalid or incompatible plugin manifests', () => {
    const invalidManifest = {
      id: 'INVALID ID WITH SPACES',
      version: 'invalid_semver',
      supportedPlatformVersion: '2.0.0'
    };

    const result = validatePluginManifest(invalidManifest);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

});
