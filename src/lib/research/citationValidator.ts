import { NewsStory } from '@/lib/news/types';
import { ResearchCitation, ResearchFinding } from './types';

export interface CitationValidationReport {
  valid: boolean;
  totalCitations: number;
  verifiedCitationsCount: number;
  unverifiedCitationsCount: number;
  unsupportedFindingsCount: number;
  hallucinatedSourceIds: string[];
  findingsFidelityScore: number; // 0 - 100
}

/**
 * Strictly validates citations against actual retrieved stories.
 * Ensures zero hallucinated citations and verifies that claims possess authentic source anchors.
 */
export function validateResearchCitations(
  citations: ResearchCitation[],
  retrievedStories: NewsStory[],
  findings: ResearchFinding[]
): CitationValidationReport {
  const storyMap = new Map<string, NewsStory>();
  for (const story of retrievedStories) {
    storyMap.set(story.id, story);
  }

  const hallucinatedSourceIds: string[] = [];
  let verifiedCitationsCount = 0;

  for (const cite of citations) {
    const rawStory = storyMap.get(cite.storyId);
    if (!rawStory) {
      hallucinatedSourceIds.push(cite.storyId);
      continue;
    }

    // Verify publisher name consistency
    const pubMatch = rawStory.sourceName.toLowerCase() === cite.publisherName.toLowerCase();
    
    // Check quote snippet relevance against story headline or summary
    const quote = (cite.quoteSnippet || '').trim().toLowerCase();
    const sourceText = `${rawStory.headline} ${rawStory.summary}`.toLowerCase();
    
    const quoteAppears = quote.length === 0 || sourceText.includes(quote) || sourceText.includes(quote.slice(0, 30));

    if (pubMatch && quoteAppears) {
      verifiedCitationsCount++;
    } else {
      hallucinatedSourceIds.push(cite.storyId);
    }
  }

  // Check each finding's supporting citations
  let unsupportedFindingsCount = 0;
  for (const finding of findings) {
    if (finding.statementType === 'FACT') {
      if (!finding.supportingCitations || finding.supportingCitations.length === 0) {
        unsupportedFindingsCount++;
        finding.validationStatus = 'UNSUPPORTED';
      } else {
        const allCitesValid = finding.supportingCitations.every(c => storyMap.has(c.storyId));
        if (!allCitesValid) {
          unsupportedFindingsCount++;
          finding.validationStatus = 'UNSUPPORTED';
        } else {
          finding.validationStatus = 'VALIDATED';
        }
      }
    }
  }

  const total = citations.length;
  const unverified = hallucinatedSourceIds.length;
  const fidelityScore = total > 0 ? Math.round((verifiedCitationsCount / total) * 100) : (findings.length > 0 ? 0 : 100);

  return {
    valid: unverified === 0 && unsupportedFindingsCount === 0,
    totalCitations: total,
    verifiedCitationsCount,
    unverifiedCitationsCount: unverified,
    unsupportedFindingsCount,
    hallucinatedSourceIds,
    findingsFidelityScore: fidelityScore
  };
}
