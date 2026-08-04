import { PromptContext } from '../types';

export interface RawAnalysisOutput {
  executiveSummary: string;
  keyDevelopments: string[];
  whyItMatters: string;
  affectedOrganizations: string[];
  timelineSummary: string;
  knownFacts: string[];
  providerName: string;
}

export interface ILlmProvider {
  providerName: string;
  generateAnalysis(context: PromptContext): Promise<RawAnalysisOutput>;
}
