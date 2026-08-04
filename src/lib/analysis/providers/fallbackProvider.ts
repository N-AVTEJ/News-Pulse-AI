import { ILlmProvider, RawAnalysisOutput } from './providerInterface';
import { PromptContext } from '../types';

export class DeterministicFallbackProvider implements ILlmProvider {
  providerName = 'grounded-deterministic-engine';

  async generateAnalysis(context: PromptContext): Promise<RawAnalysisOutput> {
    const stories = context.stories || [];
    const mainHeadline = context.canonicalHeadline;
    const publisherList = context.publishers.join(', ');

    // 1. Executive Summary
    const executiveSummary = stories.length > 1
      ? `Multi-publisher event involving ${publisherList} reporting on "${mainHeadline}". Initial coverage highlights key developments corroborated across ${stories.length} individual reports.`
      : `Single-source intelligence coverage from ${context.publishers[0] || 'reporting publisher'} detailing "${mainHeadline}".`;

    // 2. Key Developments
    const keyDevelopments = stories.slice(0, 5).map((s) => `${s.publisherName} reported: "${s.headline}".`);

    // 3. Why It Matters
    const whyItMatters = `This development directly impacts stakeholders in the ${context.primaryCategory.toUpperCase()} domain, requiring close observation of official statements and market reactions.`;

    // 4. Affected Organizations
    const affectedOrganizations = Array.from(
      new Set(
        stories.flatMap((s) => {
          const text = `${s.headline} ${s.summary}`;
          const orgs: string[] = [];
          if (text.match(/\bOpenAI\b/i)) orgs.push('OpenAI');
          if (text.match(/\bMicrosoft\b/i)) orgs.push('Microsoft');
          if (text.match(/\bGoogle\b/i)) orgs.push('Google');
          if (text.match(/\bNvidia\b/i)) orgs.push('Nvidia');
          if (text.match(/\bApple\b/i)) orgs.push('Apple');
          if (text.match(/\bMeta\b/i)) orgs.push('Meta');
          if (text.match(/\bUS Government\b/i) || text.match(/\bWhite House\b/i)) orgs.push('US Government');
          return orgs;
        })
      )
    );

    if (affectedOrganizations.length === 0) {
      affectedOrganizations.push('Industry Stakeholders', 'Reporting Publishers');
    }

    // 5. Timeline Summary
    const sortedTimeline = [...stories].sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
    const earliest = sortedTimeline[0];
    const latest = sortedTimeline[sortedTimeline.length - 1];

    const timelineSummary = stories.length > 1
      ? `First reported by ${earliest?.publisherName || 'initial source'} on ${new Date(earliest?.publishedAt || Date.now()).toLocaleTimeString()}. Latest update published by ${latest?.publisherName || 'latest source'} on ${new Date(latest?.publishedAt || Date.now()).toLocaleTimeString()}.`
      : `Reported by ${earliest?.publisherName || 'source'} on ${new Date(earliest?.publishedAt || Date.now()).toLocaleTimeString()}.`;

    // 6. Known Facts
    const knownFacts = stories.map((s) => `${s.publisherName} verified report: ${s.headline}`);

    return {
      executiveSummary,
      keyDevelopments,
      whyItMatters,
      affectedOrganizations,
      timelineSummary,
      knownFacts,
      providerName: this.providerName
    };
  }
}
