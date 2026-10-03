import { ModelTelemetryEntry, EvaluationSummaryMetrics } from './types';
import { calculateTokenCostUsd } from './cost';

const telemetryEntries: ModelTelemetryEntry[] = [
  {
    id: 'tel_001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    modelId: 'gemini-2.0-flash',
    taskType: 'SUMMARY',
    promptTokens: 420,
    completionTokens: 180,
    totalTokens: 600,
    latencyMs: 340,
    costUsd: calculateTokenCostUsd('gemini-2.0-flash', 420, 180),
    success: true
  },
  {
    id: 'tel_002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    modelId: 'gemini-1.5-pro',
    taskType: 'DEEP_ANALYSIS',
    promptTokens: 1250,
    completionTokens: 620,
    totalTokens: 1870,
    latencyMs: 1420,
    costUsd: calculateTokenCostUsd('gemini-1.5-pro', 1250, 620),
    success: true
  },
  {
    id: 'tel_003',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    modelId: 'gpt-4o-mini',
    taskType: 'CLAIM_EXTRACTION',
    promptTokens: 890,
    completionTokens: 240,
    totalTokens: 1130,
    latencyMs: 580,
    costUsd: calculateTokenCostUsd('gpt-4o-mini', 890, 240),
    success: true
  }
];

export function logModelTelemetry(
  modelId: string,
  taskType: ModelTelemetryEntry['taskType'],
  promptTokens: number,
  completionTokens: number,
  latencyMs: number,
  success: boolean,
  errorMessage?: string
): ModelTelemetryEntry {
  const costUsd = calculateTokenCostUsd(modelId, promptTokens, completionTokens);
  const entry: ModelTelemetryEntry = {
    id: `tel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    modelId,
    taskType,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    latencyMs,
    costUsd,
    success,
    errorMessage
  };

  telemetryEntries.unshift(entry);
  if (telemetryEntries.length > 200) telemetryEntries.pop();
  return entry;
}

export function getModelTelemetry(): ModelTelemetryEntry[] {
  return telemetryEntries;
}
