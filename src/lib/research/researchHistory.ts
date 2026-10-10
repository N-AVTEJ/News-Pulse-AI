/**
 * Autonomous Research Run History Store
 * Manages storage, retrieval, filtering, and state updates for research runs.
 */

import { ResearchRun } from './types';

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
    this.runs.set(run.id, { ...run });
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

    // Sort descending by startedAt
    result.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    return result.slice(0, limit);
  }

  /**
   * Update an existing research run.
   */
  updateRun(id: string, updates: Partial<ResearchRun>): ResearchRun | undefined {
    const existing = this.runs.get(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updates,
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
      return false; // Cannot cancel finished run
    }

    run.status = 'CANCELLED';
    run.cancelled = true;
    run.completedAt = new Date().toISOString();
    this.runs.set(id, run);
    return true;
  }

  /**
   * Search research runs by question keyword or entity.
   */
  searchRuns(query: string): ResearchRun[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.listRuns();

    return Array.from(this.runs.values()).filter(run => {
      const questionMatch = run.question.toLowerCase().includes(q);
      const entityMatch = run.taskPlan?.resolvedEntities?.some(e => e.name.toLowerCase().includes(q));
      const summaryMatch = run.report?.executiveSummary?.toLowerCase().includes(q);
      return questionMatch || entityMatch || summaryMatch;
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
    const sampleRunId = 'research-run-sample-1';
    const sampleRun: ResearchRun = {
      id: sampleRunId,
      question: 'What is the impact of generative AI chip supply constraints on enterprise cloud infrastructure?',
      workspaceId: 'workspace-default',
      createdBy: 'user-senior-analyst',
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3550000).toISOString(),
      executionTimeMs: 49500,
      reviewRequired: false,
      taskPlan: {
        id: 'plan-sample-1',
        primaryQuestion: 'What is the impact of generative AI chip supply constraints on enterprise cloud infrastructure?',
        subQuestions: [
          'What are current GPU and accelerator fabrication lead times from major semiconductor foundries?',
          'How are hyperscalers rationing cloud capacity and adjusting multi-instance pricing tiers?',
          'What alternative hardware architectures and edge deployment alternatives are emerging?'
        ],
        tasks: [
          {
            id: 'task-1',
            question: 'What are current GPU and accelerator fabrication lead times from major semiconductor foundries?',
            status: 'COMPLETED',
            assignedTo: 'AI_ANALYST',
            dependsOn: [],
            sourcesTargeted: ['Reuters Tech', 'Semiconductor Digest', 'Bloomberg Intelligence'],
            findings: [
              'Advanced packaging bottlenecks at leading foundries have extended accelerator delivery lead times to 26-34 weeks for premier tensor processing units.'
            ],
            confidence: 0.88,
            citations: [
              {
                sourceName: 'Reuters Tech',
                headline: 'Foundry packaging constraints tighten AI accelerator shipments',
                url: 'https://reuters.com/tech/ai-semiconductor-packaging',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                quoteSnippet: 'Packaging constraints have pushed enterprise waitlists well beyond two quarters.',
                groundedStatus: 'GROUNDED'
              }
            ]
          },
          {
            id: 'task-2',
            question: 'How are hyperscalers rationing cloud capacity and adjusting multi-instance pricing tiers?',
            status: 'COMPLETED',
            assignedTo: 'AI_ANALYST',
            dependsOn: ['task-1'],
            sourcesTargeted: ['Cloud Computing Weekly', 'Enterprise Tech Review'],
            findings: [
              'Hyperscale cloud providers have introduced quota reservations and 1-year minimum commitments for H100 and equivalent tier instances.'
            ],
            confidence: 0.84,
            citations: [
              {
                sourceName: 'Cloud Computing Weekly',
                headline: 'Enterprise cloud capacity reservations surge amidst GPU demand',
                url: 'https://cloudweekly.net/gpu-capacity-reservation',
                timestamp: new Date(Date.now() - 43200000).toISOString(),
                quoteSnippet: 'Multi-year reserved instance commitments now govern tier-1 accelerator access.',
                groundedStatus: 'GROUNDED'
              }
            ]
          }
        ],
        resolvedEntities: [
          { id: 'semiconductor-foundries', name: 'Semiconductor Foundries', type: 'SECTOR', mentions: 12 },
          { id: 'hyperscale-cloud', name: 'Hyperscale Cloud Providers', type: 'ORGANIZATION', mentions: 8 }
        ],
        timeHorizon: {
          after: new Date(Date.now() - 30 * 86400000).toISOString(),
          before: new Date().toISOString()
        },
        primaryDomain: 'TECHNOLOGY',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      report: {
        id: 'report-sample-1',
        title: 'Deep Intelligence: Generative AI Chip Supply & Enterprise Cloud Infrastructure',
        question: 'What is the impact of generative AI chip supply constraints on enterprise cloud infrastructure?',
        executiveSummary: 'AI accelerator supply constraints continue to dictate enterprise cloud expansion timelines. Advanced packaging limitations maintain lead times of up to 34 weeks, prompting major cloud hyperscalers to require long-term capacity reservations. Organizations are increasingly evaluating hybrid on-premises and specialized cloud architectures.',
        scope: {
          domains: ['TECHNOLOGY'],
          timeHorizon: {
            after: new Date(Date.now() - 30 * 86400000).toISOString(),
            before: new Date().toISOString()
          },
          sourcesSurveyed: 5,
          articlesEvaluated: 14,
          entitiesAnalyzed: 2
        },
        findings: [
          {
            id: 'finding-1',
            claim: 'Advanced packaging bottlenecks at leading foundries extend accelerator delivery lead times to 26-34 weeks.',
            synthesis: 'Packaging capacity remains the primary throttle on shipment volumes rather than silicon wafer yield alone.',
            confidence: 0.88,
            primarySourceType: 'JOURNALISTIC',
            corroborationCount: 3,
            citations: [
              {
                sourceName: 'Reuters Tech',
                headline: 'Foundry packaging constraints tighten AI accelerator shipments',
                url: 'https://reuters.com/tech/ai-semiconductor-packaging',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                quoteSnippet: 'Packaging constraints have pushed enterprise waitlists well beyond two quarters.',
                groundedStatus: 'GROUNDED'
              }
            ]
          },
          {
            id: 'finding-2',
            claim: 'Hyperscalers require multi-quarter commitments for peak tier accelerator compute.',
            synthesis: 'On-demand spot instance availability has declined in favor of reserved compute contracts.',
            confidence: 0.84,
            primarySourceType: 'JOURNALISTIC',
            corroborationCount: 2,
            citations: [
              {
                sourceName: 'Cloud Computing Weekly',
                headline: 'Enterprise cloud capacity reservations surge amidst GPU demand',
                url: 'https://cloudweekly.net/gpu-capacity-reservation',
                timestamp: new Date(Date.now() - 43200000).toISOString(),
                quoteSnippet: 'Multi-year reserved instance commitments now govern tier-1 accelerator access.',
                groundedStatus: 'GROUNDED'
              }
            ]
          }
        ],
        contradictions: [],
        evidenceGaps: [
          {
            topic: 'Exact monthly foundry wafer output quotas',
            severity: 'LOW',
            explanation: 'Foundries do not publicly disclose specific wafer allocation proportions across competing enterprise clients.'
          }
        ],
        crossEventLinks: [
          {
            clusterIdA: 'cluster-semi-1',
            clusterIdB: 'cluster-cloud-2',
            relationshipType: 'THEMATIC_CORRELATION',
            description: 'Semiconductor delivery delays directly coincide with announced price adjustments in high-performance cloud tiers.',
            confidence: 0.82
          }
        ],
        historicalTimeline: [
          {
            date: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
            event: 'Foundries announce planned capacity expansions for high-density advanced packaging lines.',
            source: 'Semiconductor Digest'
          },
          {
            date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
            event: 'Hyperscalers revise reserved instance pricing models for next-generation AI clusters.',
            source: 'Cloud Computing Weekly'
          }
        ],
        entityRelationships: [
          {
            sourceEntity: 'Semiconductor Foundries',
            targetEntity: 'Hyperscale Cloud Providers',
            relation: 'SUPPLIES_HARDWARE_TO',
            evidenceStrength: 0.95
          }
        ],
        strategicImplications: [
          'Enterprise IT organizations must forecast accelerator demand at least two quarters in advance.',
          'Small and mid-sized enterprises may rely on smaller open-weight models optimized for consumer or inferencing hardware.'
        ],
        unresolvedQuestions: [
          'Will emerging sovereign AI initiatives further tighten commercial enterprise allocations?'
        ],
        citationIntegrityScore: 94,
        confidenceScore: 86,
        generatedAt: new Date(Date.now() - 3550000).toISOString()
      },
      qualityGate: {
        passed: true,
        compositeScore: 91,
        evaluation: {
          claimGroundednessScore: 92,
          citationAccuracyScore: 94,
          corroborationScore: 88,
          neutralityScore: 90,
          completenessScore: 89,
          overallScore: 91,
          issues: [],
          evaluatedAt: new Date(Date.now() - 3550000).toISOString()
        },
        reasons: ['High groundedness and valid citations across multiple sources.']
      }
    };

    this.runs.set(sampleRunId, sampleRun);
  }
}

export const researchHistory = new ResearchHistoryStore();
