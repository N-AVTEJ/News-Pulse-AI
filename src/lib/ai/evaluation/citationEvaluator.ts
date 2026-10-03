import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';
import { CitationCheck } from '../types';

export function evaluateCitations(
  cluster: EventCluster,
  report?: AnalysisReport
): CitationCheck {
  if (!report || !report.citations || report.citations.length === 0) {
    // If no citations are present, flag as suspect if key facts exist
    return {
      score: 40,
      validCitationsCount: 0,
      invalidCitationsCount: 0,
      hallucinatedSourceIds: [],
      verifiedCitationIds: [],
      status: 'SUSPECT'
    };
  }

  // Set of valid story and source IDs present in this cluster
  const validStoryIds = new Set(cluster.articles.map(a => a.id));
  const validSourceNames = new Set(cluster.publishers.map(p => p.toLowerCase()));
  
  // Aggregate source text for quote verification
  const aggregatedSourceText = cluster.articles
    .map(a => `${a.title} ${a.description} ${a.contentSnippet || ''}`)
    .join(' ')
    .toLowerCase();

  const verifiedCitationIds: string[] = [];
  const hallucinatedSourceIds: string[] = [];

  for (const citation of report.citations) {
    const isIdValid = validStoryIds.has(citation.storyId);
    const isPublisherValid = validSourceNames.has(citation.sourceName.toLowerCase());
    
    // Check if the cited quote actually exists in the text
    const quoteClean = (citation.quote || '').trim().toLowerCase();
    const quoteExists = quoteClean.length === 0 || aggregatedSourceText.includes(quoteClean);

    if ((isIdValid || isPublisherValid) && quoteExists) {
      verifiedCitationIds.push(citation.id);
    } else {
      hallucinatedSourceIds.push(citation.storyId || citation.sourceName);
    }
  }

  const total = report.citations.length;
  const validCount = verifiedCitationIds.length;
  const invalidCount = hallucinatedSourceIds.length;

  const score = total > 0 ? Math.round((validCount / total) * 100) : 0;

  let status: CitationCheck['status'] = 'VERIFIED';
  if (score < 60 || invalidCount > 0) {
    status = invalidCount > 1 ? 'FAILED' : 'SUSPECT';
  }

  return {
    score,
    validCitationsCount: validCount,
    invalidCitationsCount: invalidCount,
    hallucinatedSourceIds,
    verifiedCitationIds,
    status
  };
}
