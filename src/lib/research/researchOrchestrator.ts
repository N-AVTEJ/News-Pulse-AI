/**
 * Autonomous Research Orchestrator
 * Coordinates question decomposition, evidence retrieval, bounded parallel execution,
 * uncertainty analysis, citation validation, report generation, quality gate evaluation,
 * and persistence.
 */

import { EventCluster } from '@/lib/clustering/types';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { ingestNews } from '@/lib/news/ingest';
import { NewsStory } from '@/lib/news/types';
import { AnalysisReport } from '@/lib/analysis/types';
import { evaluateReportQualityGate } from '@/lib/ai/evaluation/qualityGate';
import { assertPermission } from '@/lib/enterprise/permissions';
import { Role } from '@/lib/enterprise/types';
import { planResearchQuestion, validateResearchTaskPlan } from './questionPlanner';
import { executeResearchTasks } from './researchExecutor';
import { analyzeUncertaintiesAndGaps } from './uncertaintyAnalyzer';
import { generateResearchReport } from './reportGenerator';
import { validateResearchCitations } from './citationValidator';
import { researchHistory } from './researchHistory';
import { ResearchReport, ResearchRun } from './types';

export interface RunAutonomousResearchOptions {
  question: string;
  workspaceId?: string;
  organizationId?: string;
  userId?: string;
  userRole?: Role;
  clusters?: EventCluster[];
  maxConcurrency?: number;
  timeoutMs?: number;
  isCancelled?: () => boolean;
}

/**
 * Executes a full end-to-end autonomous research run.
 */
export async function runAutonomousResearch(
  options: RunAutonomousResearchOptions
): Promise<ResearchRun> {
  const startTime = Date.now();
  const {
    question,
    workspaceId = 'workspace-default',
    organizationId = 'org-enterprise-pulse',
    userId = 'user-analyst-1',
    userRole = 'ANALYST',
    maxConcurrency = 3,
    timeoutMs = 8000,
    isCancelled = () => false
  } = options;

  // 1. RBAC Guard: User must hold EDIT_INVESTIGATIONS permission to initiate autonomous research
  assertPermission(userRole, 'EDIT_INVESTIGATIONS');

  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // 2. Initialize ResearchRun in history
  const run: ResearchRun = {
    id: runId,
    question,
    userId,
    userRole,
    workspaceId,
    organizationId,
    status: 'PLANNING',
    tasks: [],
    findings: [],
    createdAt: now,
    updatedAt: now,
    startedAt: now,
    cancelRequested: false
  };

  researchHistory.saveRun(run);

  try {
    // Check cancellation
    if (isCancelled() || researchHistory.getRun(runId)?.cancelRequested) {
      run.status = 'CANCELLED';
      run.completedAt = new Date().toISOString();
      run.durationMs = Date.now() - startTime;
      researchHistory.saveRun(run);
      return run;
    }

    // 3. Step 1: Question Decomposition & Planning
    const tasks = planResearchQuestion(question);
    const planValidation = validateResearchTaskPlan(tasks);
    if (!planValidation.valid) {
      throw new Error(`Task planning validation failed: ${planValidation.errors.join(', ')}`);
    }

    run.tasks = tasks;
    run.status = 'EXECUTING';
    researchHistory.saveRun(run);

    // 4. Ingestion / Clustering Preparation (Reuse existing corpus or ingest)
    let clusters = options.clusters;
    if (!clusters || clusters.length === 0) {
      const ingestion = await ingestNews();
      const clusterResult = clusterStories(ingestion.stories);
      const verifiedResult = verifyAllClusters(clusterResult.clusters);
      clusters = verifiedResult.verifiedClusters;
    }

    // Check cancellation
    if (isCancelled() || researchHistory.getRun(runId)?.cancelRequested) {
      run.status = 'CANCELLED';
      run.completedAt = new Date().toISOString();
      run.durationMs = Date.now() - startTime;
      researchHistory.saveRun(run);
      return run;
    }

    // 5. Step 2: Bounded Concurrency Task Execution
    const taskResult = await executeResearchTasks(tasks, clusters, {
      maxConcurrency,
      timeoutMs,
      isCancelled: () => isCancelled() || Boolean(researchHistory.getRun(runId)?.cancelRequested)
    });

    if (taskResult.cancelled) {
      run.status = 'CANCELLED';
      run.tasks = taskResult.tasks;
      run.findings = taskResult.findings;
      run.completedAt = new Date().toISOString();
      run.durationMs = Date.now() - startTime;
      researchHistory.saveRun(run);
      return run;
    }

    run.tasks = taskResult.tasks;
    run.findings = taskResult.findings;
    run.status = 'ANALYZING';
    researchHistory.saveRun(run);

    // 6. Step 3: Uncertainty & Contradiction Analysis
    const uncertaintyResult = analyzeUncertaintiesAndGaps(taskResult.findings, clusters);

    // 7. Step 4: Report Synthesis
    const rawReport: ResearchReport = generateResearchReport({
      runId,
      question,
      findings: taskResult.findings,
      clusters,
      contradictions: uncertaintyResult.contradictions,
      evidenceGaps: uncertaintyResult.evidenceGaps,
      unresolvedQuestions: uncertaintyResult.unresolvedQuestions,
      citations: taskResult.citations
    });

    run.status = 'EVALUATING';
    researchHistory.saveRun(run);

    // 8. Step 5: Citation Integrity Validation
    const allStories: NewsStory[] = clusters.flatMap(c => c.stories);
    const citationReport = validateResearchCitations(rawReport.allCitations, allStories, rawReport.keyFindings);

    if (!citationReport.valid || citationReport.unverifiedCitationsCount > 0) {
      rawReport.reviewRequired = true;
      rawReport.reviewReasons.push(
        `Citation validation warning: ${citationReport.unverifiedCitationsCount} citations could not be verified against original text.`
      );
    }

    // 9. Step 6: Phase 13 Quality Gate Integration
    const primaryCluster = clusters.find(c =>
      c.canonicalHeadline.toLowerCase().includes(question.toLowerCase().slice(0, 15))
    ) || clusters[0];

    if (primaryCluster) {
      const analysisReportAdapter: AnalysisReport = {
        id: rawReport.id,
        clusterId: primaryCluster.clusterId,
        headline: primaryCluster.canonicalHeadline,
        executiveSummary: rawReport.executiveSummary,
        analysis: {
          whatHappened: rawReport.executiveSummary,
          whyItMatters: rawReport.potentialImplications.join(' '),
          whoIsAffected: [],
          whatChanged: '',
          whatIsUncertain: rawReport.unresolvedQuestions.join(' ')
        },
        citations: rawReport.allCitations.map(c => ({
          publisherName: c.publisherName,
          headline: c.headline,
          quoteSnippet: c.quoteSnippet,
          storyId: c.storyId,
          articleUrl: c.articleUrl
        })),
        confidenceScore: Math.round(citationReport.findingsFidelityScore),
        modelUsed: 'claude-3-5-sonnet',
        generatedAt: rawReport.generatedAt,
        groundingStatus: 'GROUNDED'
      };

      const qualityResult = evaluateReportQualityGate(primaryCluster, analysisReportAdapter);
      rawReport.qualityGateResult = qualityResult;

      if (!qualityResult.passed || qualityResult.decision !== 'PUBLISH') {
        rawReport.reviewRequired = true;
        rawReport.reviewReasons.push(...qualityResult.reasons);
      }
    }

    // 10. Step 7: Completion & Persistence
    run.report = rawReport;
    run.status = 'COMPLETED';
    run.completedAt = new Date().toISOString();
    run.durationMs = Date.now() - startTime;
    researchHistory.saveRun(run);

    return run;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown orchestrator error';
    run.status = 'FAILED';
    run.error = errorMsg;
    run.completedAt = new Date().toISOString();
    run.durationMs = Date.now() - startTime;
    researchHistory.saveRun(run);
    throw error;
  }
}
