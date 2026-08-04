import { ILlmProvider, RawAnalysisOutput } from './providerInterface';
import { DeterministicFallbackProvider } from './fallbackProvider';
import { PromptContext } from '../types';

export class GeminiProvider implements ILlmProvider {
  providerName = 'google-gemini-2.0-flash';
  private fallback = new DeterministicFallbackProvider();

  async generateAnalysis(context: PromptContext): Promise<RawAnalysisOutput> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.log('[GeminiProvider] No GEMINI_API_KEY detected in env. Using Grounded Deterministic Engine.');
      return this.fallback.generateAnalysis(context);
    }

    try {
      // In production with key present, invoke Gemini endpoint
      const promptText = `
You are an expert news intelligence analyst. Generate structured analysis ONLY using the following verified evidence. Do NOT invent facts or external quotes.

CANONICAL HEADLINE: ${context.canonicalHeadline}
SUMMARY: ${context.summary}
PUBLISHERS: ${context.publishers.join(', ')}
VERIFICATION STATUS: ${context.verificationStatus}

STORIES:
${context.stories.map(s => `- [${s.id}] ${s.publisherName}: ${s.headline} (${s.summary})`).join('\n')}

Respond in valid JSON with keys:
{
  "executiveSummary": "...",
  "keyDevelopments": ["..."],
  "whyItMatters": "...",
  "affectedOrganizations": ["..."],
  "timelineSummary": "...",
  "knownFacts": ["..."]
}
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error ${response.status}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse JSON from output
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          executiveSummary: parsed.executiveSummary || context.summary,
          keyDevelopments: Array.isArray(parsed.keyDevelopments) ? parsed.keyDevelopments : [context.canonicalHeadline],
          whyItMatters: parsed.whyItMatters || 'High signal development.',
          affectedOrganizations: Array.isArray(parsed.affectedOrganizations) ? parsed.affectedOrganizations : [],
          timelineSummary: parsed.timelineSummary || 'Reported recently.',
          knownFacts: Array.isArray(parsed.knownFacts) ? parsed.knownFacts : [context.canonicalHeadline],
          providerName: this.providerName
        };
      }

      return this.fallback.generateAnalysis(context);

    } catch (err: unknown) {
      console.warn('[GeminiProvider] Gemini API call failed. Falling back to Grounded Engine:', err);
      return this.fallback.generateAnalysis(context);
    }
  }
}
