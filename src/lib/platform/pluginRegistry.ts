import { validatePluginManifest } from './pluginManifest';
import { PluginInstance, PluginManifest } from './types';

const defaultPlugins: PluginInstance[] = [
  {
    manifest: {
      id: 'plugin_slack_notifier',
      name: 'Slack Intelligence Notifier',
      version: '1.0.0',
      author: 'NewsPulse Enterprise Team',
      category: 'NOTIFICATION_PROVIDER',
      permissions: ['READ_NEWS', 'EMIT_NOTIFICATIONS', 'NETWORK_OUTBOUND'],
      capabilities: ['Send Slack Webhooks on Breaking News'],
      supportedPlatformVersion: '1.0.0',
      entryPoint: 'index.js',
      description: 'Dispatches breaking news alerts directly to Slack channels.'
    },
    enabled: true,
    loadedAt: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    manifest: {
      id: 'plugin_jira_threat_tickets',
      name: 'Jira Automated Threat Tickets',
      version: '1.0.0',
      author: 'Security Operations',
      category: 'WORKFLOW_ACTION',
      permissions: ['READ_NEWS', 'NETWORK_OUTBOUND'],
      capabilities: ['File Jira Tickets for Critical Investigations'],
      supportedPlatformVersion: '1.0.0',
      entryPoint: 'index.js',
      description: 'Creates Jira tickets for unverified critical security claims.'
    },
    enabled: true,
    loadedAt: new Date().toISOString(),
    status: 'ACTIVE'
  }
];

export function getPlugins(): PluginInstance[] {
  return defaultPlugins;
}

export function registerPlugin(manifest: PluginManifest): PluginInstance {
  const { valid, errors } = validatePluginManifest(manifest);
  if (!valid) {
    throw new Error(`Invalid Plugin Manifest: ${errors.join(' ')}`);
  }

  const existing = defaultPlugins.find(p => p.manifest.id === manifest.id);
  if (existing) {
    existing.manifest = manifest;
    existing.status = 'ACTIVE';
    return existing;
  }

  const instance: PluginInstance = {
    manifest,
    enabled: true,
    loadedAt: new Date().toISOString(),
    status: 'ACTIVE'
  };

  defaultPlugins.push(instance);
  return instance;
}

export function togglePluginStatus(pluginId: string, enabled: boolean): PluginInstance {
  const instance = defaultPlugins.find(p => p.manifest.id === pluginId);
  if (!instance) throw new Error(`Plugin '${pluginId}' not found.`);

  instance.enabled = enabled;
  instance.status = enabled ? 'ACTIVE' : 'DISABLED';
  return instance;
}
