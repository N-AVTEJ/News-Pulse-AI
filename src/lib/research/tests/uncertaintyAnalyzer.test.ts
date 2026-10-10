import { describe, it, expect } from 'vitest';
import { analyzeUncertaintiesAndGaps } from '../uncertaintyAnalyzer';
import { EventCluster } from '@/lib/clustering/types';
import { ResearchFinding } from '../types';

describe('Phase 14: Uncertainty & Contradiction Analyzer', () => {
  it('should detect conflicting reporting from verified cluster conflict flags', () => {
    const conflictedCluster: EventCluster = {
      clusterId: 'cluster-conflict-1',
      canonicalHeadline: 'Differing death toll figures reported in regional disaster',
      summary: 'Conflicting official releases show between 50 and 200 casualties.',
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      stories: [],
      sources: ['Source A', 'Source B'],
      publishers: ['Source A', 'Source B'],
      primaryCategory: 'world',
      velocity: 2.0,
      urgencyScore: 90,
      verificationResult: {
        clusterId: 'cluster-conflict-1',
        verificationStatus: 'CONFLICTING_REPORTS',
        supportingSources: ['Source A', 'Source B'],
        independentSources: 2,
        primarySources: [],
        secondarySources: [],
        conflictingSources: [
          {
            id: 'conf-1',
            sourceId: 's-a',
            sourceName: 'Source A',
            sourceUrl: '',
            articleUrl: '',
            headline: 'Casualty figure initial',
            summary: '50 reported',
            publishedAt: '',
            retrievedAt: '',
            category: 'world'
          }
        ],
        evidenceCount: 2,
        verificationReasons: ['Conflicting casualty counts reported'],
        generatedAt: new Date().toISOString(),
        semanticAgreement: null,
        claimConsistency: null
      }
    };

    const findings: ResearchFinding[] = [
      {
        id: 'f-1',
        taskId: 't-1',
        claim: 'Casualty counts vary significantly across outlets.',
        statementType: 'FACT',
        supportingCitations: [],
        contradictingCitations: [],
        confidenceScore: 70
      }
    ];

    const result = analyzeUncertaintiesAndGaps(findings, [conflictedCluster]);

    expect(result.contradictions.length).toBeGreaterThan(0);
    expect(result.contradictions[0].topic).toContain('Differing death toll');
    expect(result.contradictions[0].resolutionStatus).toBe('PERSISTENT_CONFLICT');
  });

  it('should detect single-source syndication dependency gaps', () => {
    const syndicatedCluster: EventCluster = {
      clusterId: 'cluster-synd-1',
      canonicalHeadline: 'Single outlet publishes multiple syndicate wire stories',
      summary: 'Multiple wire reprints from the same single news agency.',
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      stories: [
        { id: 's1', sourceId: 'wire', sourceName: 'SingleWire', sourceUrl: '', articleUrl: '', headline: '', summary: '', publishedAt: '', retrievedAt: '', category: 'world' },
        { id: 's2', sourceId: 'wire', sourceName: 'SingleWire', sourceUrl: '', articleUrl: '', headline: '', summary: '', publishedAt: '', retrievedAt: '', category: 'world' },
        { id: 's3', sourceId: 'wire', sourceName: 'SingleWire', sourceUrl: '', articleUrl: '', headline: '', summary: '', publishedAt: '', retrievedAt: '', category: 'world' }
      ],
      sources: ['SingleWire'],
      publishers: ['SingleWire'], // Only 1 publisher, but 3 stories
      primaryCategory: 'world',
      velocity: 1.0,
      urgencyScore: 50
    };

    const result = analyzeUncertaintiesAndGaps([], [syndicatedCluster]);

    expect(result.evidenceGaps.some(g => g.gapType === 'INSUFFICIENT_DIVERSITY')).toBe(true);
  });

  it('should surface unresolved questions rather than pretending total certainty', () => {
    const result = analyzeUncertaintiesAndGaps([], []);
    expect(result.unresolvedQuestions.length).toBeGreaterThan(0);
  });
});
