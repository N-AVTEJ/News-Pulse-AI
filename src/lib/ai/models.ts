import { ModelDefinition } from './types';

export const SUPPORTED_MODELS: Record<string, ModelDefinition> = {
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    tier: 'FAST',
    contextWindow: 1048576,
    inputCostPer1kTokens: 0.0001,
    outputCostPer1kTokens: 0.0004,
    typicalLatencyMs: 380,
    isAvailable: true
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    tier: 'REASONING',
    contextWindow: 2097152,
    inputCostPer1kTokens: 0.00125,
    outputCostPer1kTokens: 0.005,
    typicalLatencyMs: 1450,
    isAvailable: true
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    tier: 'BALANCED',
    contextWindow: 128000,
    inputCostPer1kTokens: 0.00015,
    outputCostPer1kTokens: 0.0006,
    typicalLatencyMs: 620,
    isAvailable: true
  },
  'deterministic-local-scout': {
    id: 'deterministic-local-scout',
    name: 'Deterministic Local Scout',
    provider: 'Local/NewsPulse',
    tier: 'FALLBACK',
    contextWindow: 64000,
    inputCostPer1kTokens: 0,
    outputCostPer1kTokens: 0,
    typicalLatencyMs: 15,
    isAvailable: true
  }
};

export function getModelById(modelId: string): ModelDefinition {
  return SUPPORTED_MODELS[modelId] || SUPPORTED_MODELS['deterministic-local-scout'];
}

export function getAllModels(): ModelDefinition[] {
  return Object.values(SUPPORTED_MODELS);
}
