const CURRENT_PLATFORM_VERSION = '1.0.0';

export function validatePluginManifest(manifest: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be a valid JSON object.'] };
  }

  const m = manifest as Record<string, unknown>;

  if (!m.id || typeof m.id !== 'string' || !/^[a-z0-9-_]+$/i.test(m.id)) {
    errors.push('Manifest "id" must be a alphanumeric string (dashes/underscores allowed).');
  }

  if (!m.name || typeof m.name !== 'string') {
    errors.push('Manifest "name" is required.');
  }

  if (!m.version || typeof m.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(m.version)) {
    errors.push('Manifest "version" must follow semver format (e.g. 1.0.0).');
  }

  if (!m.category || typeof m.category !== 'string') {
    errors.push('Manifest "category" is required.');
  }

  if (!m.entryPoint || typeof m.entryPoint !== 'string') {
    errors.push('Manifest "entryPoint" script path is required.');
  }

  if (m.supportedPlatformVersion && typeof m.supportedPlatformVersion === 'string') {
    if (!m.supportedPlatformVersion.startsWith('1.')) {
      errors.push(`Incompatible platform version ${m.supportedPlatformVersion}. Current platform version is ${CURRENT_PLATFORM_VERSION}.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
