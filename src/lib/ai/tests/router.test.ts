import { describe, it, expect } from 'vitest';
import { routeTask } from '../router';

describe('AI Model Router', () => {
  it('routes DEEP_ANALYSIS to REASONING tier', () => {
    const decision = routeTask('DEEP_ANALYSIS', 4000);
    expect(decision.selectedModel.tier).toBe('REASONING');
    expect(decision.selectedModel.id).toBe('gemini-1.5-pro');
    expect(decision.estimatedCostUsd).toBeGreaterThan(0);
  });

  it('routes SUMMARY to FAST tier', () => {
    const decision = routeTask('SUMMARY', 1500);
    expect(decision.selectedModel.tier).toBe('FAST');
    expect(decision.selectedModel.id).toBe('gemini-2.0-flash');
  });

  it('routes CLAIM_EXTRACTION to BALANCED tier', () => {
    const decision = routeTask('CLAIM_EXTRACTION', 2000);
    expect(decision.selectedModel.tier).toBe('BALANCED');
    expect(decision.selectedModel.id).toBe('gpt-4o-mini');
  });

  it('honors local fallback preference', () => {
    const decision = routeTask('DEEP_ANALYSIS', 2000, true);
    expect(decision.selectedModel.tier).toBe('FALLBACK');
    expect(decision.selectedModel.id).toBe('deterministic-local-scout');
    expect(decision.estimatedCostUsd).toBe(0);
  });
});
