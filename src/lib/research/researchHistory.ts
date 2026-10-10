/**
 * Autonomous Research Run History Store
 * Manages storage, retrieval, filtering, and state updates for research runs.
 */

import { ResearchRun, ResearchReport } from './types';

class ResearchHistoryStore {
  private runs: Map<string, ResearchRun> = new Map();
  private maxEntries: number = 200;

  constructor() {
    this.seedSampleRuns();
  }

  /**
   * Save or update a research run.
   */
  saveRun(run: ResearchRun): void {
    this.runs.set(run.id, { ...run, updatedAt: new Date().toISOString() });
    // Enforce max size limit
    if (this.runs.size > this.maxEntries) {
      const oldestKey = this.runs.keys().next().value;
      if (oldestKey) {
        this.runs.delete(oldestKey);
      }
    }
  }

  /**
   * Retrieve a research run by its ID.
   */
  getRun(id: string): ResearchRun | undefined {
    return this.runs.get(id);
  }

  /**
   * List research runs with optional workspace and limit filtering.
   */
  listRuns(workspaceId?: string, limit: number = 50): ResearchRun[] {
    let result = Array.from(this.runs.values());

    if (workspaceId && workspaceId !== 'default' && workspaceId !== 'all') {
      result = result.filter(r => r.workspaceId === workspaceId);
    }

    // Sort descending by createdAt / startedAt
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result.slice(0, limit);
  }

  /**
   * Update an existing research run.
   */
  updateRun(id: string, updates: Partial<ResearchRun>): ResearchRun | undefined {
    const existing = this.runs.get(id);
    if (!existing) return undefined;

    const updated: ResearchRun = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.runs.set(id, updated);
    return updated;
  }

  /**
   * Cancel an in-progress research run.
   */
  cancelRun(id: string): boolean {
    const run = this.runs.get(id);
    if (!run) return false;

    if (run.status === 'COMPLETED' || run.status === 'FAILED' || run.status === 'CANCELLED') {
      return false; // Cannot cancel already terminated run
    }

    run.status = 'CANCELLED';
    run.cancelRequested = true;
    run.completedAt = new Date().toISOString();
    run.updatedAt = new Date().toISOString();
    this.runs.set(id, run);
    return true;
  }

  /**
   * Search research runs by question keyword or executive summary.
   */
  searchRuns(query: string): ResearchRun[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.listRuns();

    return Array.from(this.runs.values()).filter(run => {
      const questionMatch = run.question.toLowerCase().includes(q);
      const summaryMatch = run.report?.executiveSummary?.toLowerCase().includes(q);
      const findingsMatch = run.findings.some(f => f.claim.toLowerCase().includes(q));
      return questionMatch || summaryMatch || findingsMatch;
    });
  }

  /**
   * Clear all stored runs (used for testing resets).
   */
  clear(): void {
    this.runs.clear();
  }

  /**
   * Seed realistic sample runs for immediate UI preview and verification.
   */
  private seedSampleRuns(): void {
    const now = new Date();
    const pastHour = new Date(now.getTime() - 3600000).toISOString();
    const past50m = new Date(now.getTime() - 3000000).toISOString();

    const sampleReport: ResearchReport = {
      id: 'report-sample-1',
      runId: 'run-seed-1',
      question: 'What is the impact of generative AI chip supply constraints on enterprise cloud infrastructure?',
      executiveSummary: 'AI accelerator supply constraints continue to dictate enterprise cloud expansion timelines. Advanced packaging limitations maintain lead times of up to 34 weeks, prompting major cloud hyperscalers to require multi-quarter capacity reservations. Organizations are increasingly evaluating hybrid on-premises and specialized cloud architectures.',
      researchScope: 'Cross-industry analysis of semiconductor fabrication bottlenecks, cloud pricing shifts, and enterprise AI inference infrastructure from 14 verified articles.',
      keyFindings: [
        {
          id: 'finding-1',
          taskId: 'task-1',
          claim: 'Advanced packaging bottlenecks extend AI accelerator delivery lead times to 26-34 weeks for top-tier chips.',
          statementType: 'FACT',
          supportingCitations: [
            {
              id: 'cite-1',
              storyId: 'story-semi-1',
              clusterId: 'cluster-semi-1',
              publisherName: 'Reuters Tech',
              sourceUrl: 'https://reuters.com/tech',
              articleUrl: 'https://reuters.com/tech/ai-semiconductor-packaging',
              headline: 'Foundry packaging constraints tighten AI accelerator shipments',
              publishedAt: new Date(now.getTime() - 86400000).toISOString(),
              quoteSnippet: 'Packaging constraints have pushed enterprise waitlists well beyond two quarters.',
              isPrimarySource: true
            }
          ],
          contradictingCitations: [],
          confidenceScore: 92,
          validationStatus: 'VALIDATED'
        },
        {
          id: 'finding-2',
          taskId: 'task-2',
          claim: 'Cloud hyperscalers have introduced quota reservations and 1-year minimum commitments for H100 and equivalent tier instances.',
          statementType: 'FACT',
          supportingCitations: [
            {
              id: 'cite-2',
              storyId: 'story-cloud-1',
              clusterId: 'cluster-cloud-1',
              publisherName: 'Cloud Computing Weekly',
              sourceUrl: 'https://cloudweekly.net',
              articleUrl: 'https://cloudweekly.net/gpu-capacity-reservation',
              headline: 'Enterprise cloud capacity reservations surge amidst GPU demand',
              publishedAt: new Date(now.getTime() - 43200000).toISOString(),
              quoteSnippet: 'Multi-year reserved instance commitments now govern tier-1 accelerator access.',
              isPrimarySource: true
            }
          ],
          contradictingCitations: [],
          confidenceScore: 88,
          validationStatus: 'VALIDATED'
        }
      ],
      contradictions: [],
      evidenceGaps: [
        {
          id: 'gap-1',
          topic: 'Foundry Wafer Allocation Quotas',
          description: 'Leading foundries do not publish exact percentage allocations across cloud hyperscaler clients.',
          recommendedNextSteps: 'Monitor upcoming quarterly 10-Q regulatory filings and earnings calls.'
        }
      ],
      crossEventLinks: [
        {
          id: 'rel-1',
          sourceClusterId: 'cluster-semi-1',
          targetClusterId: 'cluster-cloud-1',
          relationType: 'THEMATIC_CORRELATION',
          description: 'Advanced packaging delays directly coincide with cloud compute instance price adjustments.'
        }
      ],
      historicalTimeline: [
        {
          timestamp: new Date(now.getTime() - 20 * 86400000).toISOString(),
          eventHeadline: 'Foundries announce planned capacity expansions for high-density advanced packaging lines.',
          source: 'Semiconductor Digest',
          significance: 'High'
        },
        {
          timestamp: new Date(now.getTime() - 5 * 86400000).toISOString(),
          eventHeadline: 'Hyperscalers revise reserved instance pricing models for next-generation AI clusters.',
          source: 'Cloud Computing Weekly',
          significance: 'High'
        }
      ],
      entityRelationships: [
        {
          entityA: 'Semiconductor Foundries',
          relationship: 'SUPPLIES_HARDWARE_TO',
          entityB: 'Hyperscale Cloud Providers',
          evidence: 'Foundry shipment quotas dictate available virtual machine availability.'
        }
      ],
      potentialImplications: [
        'Enterprise IT departments must forecast AI accelerator capacity requirements at least 6 months in advance.',
        'Mid-market software enterprises will accelerate adoption of quantized and smaller open-weight models.'
      ],
      unresolvedQuestions: [
        'Will upcoming 2nm node transitions ease or exacerbate packaging constraints in late 2026?'
      ],
      allCitations: [
        {
          id: 'cite-1',
          storyId: 'story-semi-1',
          clusterId: 'cluster-semi-1',
          publisherName: 'Reuters Tech',
          sourceUrl: 'https://reuters.com/tech',
          articleUrl: 'https://reuters.com/tech/ai-semiconductor-packaging',
          headline: 'Foundry packaging constraints tighten AI accelerator shipments',
          publishedAt: new Date(now.getTime() - 86400000).toISOString(),
          quoteSnippet: 'Packaging constraints have pushed enterprise waitlists well beyond two quarters.',
          isPrimarySource: true
        },
        {
          id: 'cite-2',
          storyId: 'story-cloud-1',
          clusterId: 'cluster-cloud-1',
          publisherName: 'Cloud Computing Weekly',
          sourceUrl: 'https://cloudweekly.net',
          articleUrl: 'https://cloudweekly.net/gpu-capacity-reservation',
          headline: 'Enterprise cloud capacity reservations surge amidst GPU demand',
          publishedAt: new Date(now.getTime() - 43200000).toISOString(),
          quoteSnippet: 'Multi-year reserved instance commitments now govern tier-1 accelerator access.',
          isPrimarySource: true
        }
      ],
      qualityGateResult: {
        clusterId: 'cluster-semi-1',
        passed: true,
        decision: 'PUBLISH',
        overallScore: 92,
        grounding: {
          score: 94,
          lexicalOverlapRatio: 0.85,
          entityGroundingRatio: 0.90,
          unsupportedTokensCount: 4,
          status: 'HIGH',
          details: 'High factual grounding across verified articles.'
        },
        citations: {
          score: 95,
          validCitationsCount: 2,
          invalidCitationsCount: 0,
          hallucinatedSourceIds: [],
          verifiedCitationIds: ['cite-1', 'cite-2'],
          status: 'VERIFIED'
        },
        claims: {
          score: 90,
          totalClaimsCount: 2,
          supportedClaimsCount: 2,
          unsupportedClaims: [],
          contradictedClaims: [],
          confidence: 0.92
        },
        reasons: ['High grounding fidelity and authentic verified citations.'],
        evaluatedAt: past50m
      },
      reviewRequired: false,
      reviewReasons: [],
      generatedAt: past50m
    };

    const sampleRun: ResearchRun = {
      id: 'run-seed-1',
      question: 'What is the impact of generative AI chip supply constraints on enterprise cloud infrastructure?',
      userId: 'user-senior-analyst',
      userRole: 'ANALYST',
      workspaceId: 'workspace-default',
      organizationId: 'org-enterprise-pulse',
      status: 'COMPLETED',
      tasks: [
        {
          id: 'task-1',
          question: 'What are current GPU and accelerator fabrication lead times from major semiconductor foundries?',
          topic: 'Semiconductors',
          targetEntities: ['Semiconductor Foundries'],
          requiredEvidenceType: 'PRIMARY_SOURCE',
          status: 'COMPLETED',
          resultReferences: ['cluster-semi-1'],
          findingsCount: 1,
          durationMs: 420
        },
        {
          id: 'task-2',
          question: 'How are hyperscalers rationing cloud capacity and adjusting multi-instance pricing tiers?',
          topic: 'Cloud Infrastructure',
          targetEntities: ['Hyperscale Cloud Providers'],
          requiredEvidenceType: 'CORROBORATED_REPORT',
          status: 'COMPLETED',
          resultReferences: ['cluster-cloud-1'],
          findingsCount: 1,
          durationMs: 380
        }
      ],
      findings: sampleReport.keyFindings,
      report: sampleReport,
      createdAt: pastHour,
      updatedAt: past50m,
      startedAt: pastHour,
      completedAt: past50m,
      durationMs: 12500,
      cancelRequested: false
    };

    this.runs.set(sampleRun.id, sampleRun);
  }
}

export const researchHistory = new ResearchHistoryStore();
