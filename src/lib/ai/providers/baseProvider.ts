export interface GenerateOptions {
  modelId: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateResult {
  text: string;
  modelId: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  success: boolean;
  error?: string;
}

export interface ModelProvider {
  name: string;
  generateText(options: GenerateOptions): Promise<GenerateResult>;
}
