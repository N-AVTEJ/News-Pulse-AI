import { describe, it, expect } from 'vitest';
import { validateResearchCitations } from '../citationValidator';
import { NewsStory } from '@/lib/news/types';
import { ResearchCitation, ResearchFinding } from '../types';

describe('Phase 14: Citation Validator', () => {
  const authenticStory: NewsStory = {
    id: 'story-auth-1',
    sourceId: 'reuters',
    sourceName: 'Reuters',
    sourceUrl: 'https://reuters.com',
    articleUrl: 'https://reuters.com/tech/ai-superchips',
    headline: 'Semiconductor manufacturers report surge in accelerator output',
    summary: 'Fab lines achieved 20% higher yields for leading-edge generative acceleration circuits.',
    publishedAt: '2026-03-01T12:00:00Z',
    retrievedAt: '2026-03-01T12:30:00Z',
    category: 'ai-tech'
  };

  it('should validate authentic citations linked to actual stories', () => {
    const validCitation: ResearchCitation = {
      id: 'cite-1',
      storyId: 'story-auth-1',
      clusterId: 'cluster-1',
      publisherName: 'Reuters',
      sourceUrl: 'https://reuters.com',
      articleUrl: 'https://reuters.com/tech/ai-superchips',
      headline: 'Semiconductor manufacturers report surge in accelerator output',
      publishedAt: '2026-03-01T12:00:00Z',
      quoteSnippet: 'Fab lines achieved 20% higher yields',
      isPrimarySource: true
    };

    const finding: ResearchFinding = {
      id: 'find-1',
      taskId: 'task-1',
      claim: 'Semiconductor manufacturers observed higher chip production yields.',
      statementType: 'FACT',
      supportingCitations: [validCitation],
      contradictingCitations: [],
      confidenceScore: 90
    };

    const report = validateResearchCitations([validCitation], [authenticStory], [finding]);

    expect(report.valid).toBe(true);
    expect(report.totalCitations).toBe(1);
    expect(report.verifiedCitationsCount).toBe(1);
    expect(report.unverifiedCitationsCount).toBe(0);
    expect(report.hallucinatedSourceIds).toHaveLength(0);
    expect(report.findingsFidelityScore).toBe(100);
  });

  it('should detect and reject hallucinated citations missing from story corpus', () => {
    const fakeCitation: ResearchCitation = {
      id: 'cite-fake',
      storyId: 'story-nonexistent-99',
      clusterId: 'cluster-fake',
      publisherName: 'Invented Press',
      sourceUrl: 'https://fake.news',
      articleUrl: 'https://fake.news/article',
      headline: 'Completely made up headline',
      publishedAt: '2026-03-01T12:00:00Z',
      quoteSnippet: 'Fictitious quote that does not exist',
      isPrimarySource: false
    };

    const finding: ResearchFinding = {
      id: 'find-fake',
      taskId: 'task-1',
      claim: 'Fabricated claim without real evidence.',
      statementType: 'FACT',
      supportingCitations: [fakeCitation],
      contradictingCitations: [],
      confidenceScore: 30
    };

    const report = validateResearchCitations([fakeCitation], [authenticStory], [finding]);

    expect(report.valid).toBe(false);
    expect(report.hallucinatedSourceIds).toContain('story-nonexistent-99');
    expect(report.unverifiedCitationsCount).toBe(1);
    expect(report.findingsFidelityScore).toBeLessThan(70);
  });

  it('should flag unsupported findings that have no supporting citations', () => {
    const unsupportedFinding: ResearchFinding = {
      id: 'find-unsupported',
      taskId: 'task-1',
      claim: 'Uncited assertion that lacks grounding.',
      statementType: 'FACT',
      supportingCitations: [],
      contradictingCitations: [],
      confidenceScore: 40
    };

    const report = validateResearchCitations([], [authenticStory], [unsupportedFinding]);

    expect(report.unsupportedFindingsCount).toBe(1);
    expect(report.findingsFidelityScore).toBeLessThan(100);
  });
});
