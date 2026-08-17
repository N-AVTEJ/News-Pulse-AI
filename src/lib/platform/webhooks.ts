import { WebhookDeliveryLog } from './types';

let webhookLogsStore: WebhookDeliveryLog[] = [
  {
    id: 'whlog_001',
    targetUrl: 'https://api.enterprise.com/webhooks/newspulse',
    eventType: 'EventClusterCreated',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'DELIVERED',
    statusCode: 200,
    attempts: 1
  }
];

export function getWebhookLogs(): WebhookDeliveryLog[] {
  return webhookLogsStore;
}

export function generateWebhookSignature(payload: string, secret: string): string {
  // Simple deterministic signature representation
  let hash = 0;
  const str = payload + secret;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `sha256=${Math.abs(hash).toString(16)}`;
}

export function dispatchWebhookPayload(targetUrl: string, eventType: string, payload: Record<string, unknown>, secret: string = 'np_wh_secret'): WebhookDeliveryLog {
  const payloadStr = JSON.stringify(payload);
  const signature = generateWebhookSignature(payloadStr, secret);

  const log: WebhookDeliveryLog = {
    id: `whlog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    targetUrl,
    eventType,
    timestamp: new Date().toISOString(),
    status: 'DELIVERED',
    statusCode: 200,
    attempts: 1
  };

  webhookLogsStore.unshift(log);
  return log;
}
