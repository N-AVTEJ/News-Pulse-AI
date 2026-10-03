import { TaskType, RouteDecision } from './types';
import { SUPPORTED_MODELS } from './models';
import { calculateTokenCostUsd } from './cost';

export function routeTask(
  taskType: TaskType,
  contextLengthChars: number = 2000,
  preferLocalFallback: boolean = false
): RouteDecision {
  if (preferLocalFallback) {
    const local = SUPPORTED_MODELS['deterministic-local-scout'];
    return {
      taskType,
      selectedModel: local,
      reason: 'Local fallback requested or provider network disabled',
      estimatedCostUsd: 0,
      fallbackModelId: local.id
    };
  }

  const estimatedPromptTokens = Math.ceil(contextLengthChars / 4);

  switch (taskType) {
    case 'DEEP_ANALYSIS': {
      const selected = SUPPORTED_MODELS['gemini-1.5-pro'] || SUPPORTED_MODELS['gemini-2.0-flash'];
      const estCost = calculateTokenCostUsd(selected.id, estimatedPromptTokens, 800);
      return {
        taskType,
        selectedModel: selected,
        reason: 'Complex cross-source synthesis and uncertainty analysis requires REASONING tier model',
        estimatedCostUsd: estCost,
        fallbackModelId: 'gemini-2.0-flash'
      };
    }

    case 'VERIFICATION_CHECK':
    case 'CLAIM_EXTRACTION': {
      const selected = SUPPORTED_MODELS['gpt-4o-mini'] || SUPPORTED_MODELS['gemini-2.0-flash'];
      const estCost = calculateTokenCostUsd(selected.id, estimatedPromptTokens, 400);
      return {
        taskType,
        selectedModel: selected,
        reason: 'Structured factual claim comparison fits BALANCED tier model for speed and accuracy',
        estimatedCostUsd: estCost,
        fallbackModelId: 'gemini-2.0-flash'
      };
    }

    case 'SUMMARY':
    case 'CLASSIFICATION':
    default: {
      const selected = SUPPORTED_MODELS['gemini-2.0-flash'];
      const estCost = calculateTokenCostUsd(selected.id, estimatedPromptTokens, 250);
      return {
        taskType,
        selectedModel: selected,
        reason: 'High-throughput short summary and taxonomy tagging mapped to FAST tier model',
        estimatedCostUsd: estCost,
        fallbackModelId: 'deterministic-local-scout'
      };
    }
  }
}
