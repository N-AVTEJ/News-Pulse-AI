import { PluginPermission } from './types';

export function hasPluginPermission(granted: PluginPermission[], required: PluginPermission): boolean {
  return granted.includes(required);
}

export function assertPluginPermission(granted: PluginPermission[], required: PluginPermission, pluginId: string): void {
  if (!hasPluginPermission(granted, required)) {
    throw new Error(`PluginSandbox Violation: Plugin '${pluginId}' lacks required capability '${required}'. Execution blocked.`);
  }
}
