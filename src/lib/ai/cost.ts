import { getModelById } from './models';

export function calculateTokenCostUsd(
  modelId: string,
  promptTokens: number,
  completionTokens: number
): number {
  const model = getModelById(modelId);
  const promptCost = (promptTokens / 1000) * model.inputCostPer1kTokens;
  const completionCost = (completionTokens / 1000) * model.outputCostPer1kTokens;
  return Number((promptCost + completionCost).toFixed(6));
}

export function estimateCostForCharacters(
  modelId: string,
  promptChars: number,
  estimatedCompletionChars: number
): number {
  // Approximate standard ratio: ~4 chars per token
  const promptTokens = Math.ceil(promptChars / 4);
  const completionTokens = Math.ceil(estimatedCompletionChars / 4);
  return calculateTokenCostUsd(modelId, promptTokens, completionTokens);
}
