import { ModelProvider, GenerateOptions, GenerateResult } from './baseProvider';

export class MockModelProvider implements ModelProvider {
  name = 'MockModelProvider';

  async generateText(options: GenerateOptions): Promise<GenerateResult> {
    const start = Date.now();
    const promptLen = options.prompt.length;
    const promptTokens = Math.ceil(promptLen / 4);
    const completionTokens = 120;
    
    const text = `Grounded intelligence synthesis based on cluster evidence. Verified citations and factual claims aligned with provided inputs.`;
    
    return {
      text,
      modelId: options.modelId,
      promptTokens,
      completionTokens,
      latencyMs: Date.now() - start + 25,
      success: true
    };
  }
}

export const mockModelProvider = new MockModelProvider();
