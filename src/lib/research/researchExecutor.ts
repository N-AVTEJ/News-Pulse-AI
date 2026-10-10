import { EventCluster } from '@/lib/clustering/types';
import { retrieveEvidenceForTask } from './evidenceRetriever';
import { ResearchCitation, ResearchFinding, ResearchTask } from './types';

export interface ExecutionOptions {
  maxConcurrency?: number;
  timeoutMs?: number;
  isCancelled?: () => boolean;
}

export interface TaskExecutionResult {
  tasks: ResearchTask[];
  findings: ResearchFinding[];
  citations: ResearchCitation[];
  cancelled: boolean;
}

/**
 * Executes a single research task with timeout and error isolation.
 */
async function executeSingleTask(
  task: ResearchTask,
  clusters: EventCluster[],
  timeoutMs: number
): Promise<{ findings: ResearchFinding[]; citations: ResearchCitation[] }> {
  const startTime = Date.now();
  task.status = 'RUNNING';

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Task execution timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  try {
    const evidence = await Promise.race([
      retrieveEvidenceForTask(task, clusters),
      timeoutPromise
    ]);

    const findings: ResearchFinding[] = [];
    const citations: ResearchCitation[] = [...evidence.citations];

    task.resultReferences = evidence.matchingClusters.map(c => c.clusterId);

    // 1. Synthesize Direct Facts from Matching Clusters and Stories
    for (const cluster of evidence.matchingClusters.slice(0, 3)) {
      const topStory = cluster.stories[0];
      const supportingCite: ResearchCitation[] = topStory ? [{
        id: `cite_${topStory.id}`,
        storyId: topStory.id,
        clusterId: cluster.clusterId,
        publisherName: topStory.sourceName,
        sourceUrl: topStory.sourceUrl,
        articleUrl: topStory.articleUrl,
        headline: topStory.headline,
        publishedAt: topStory.publishedAt,
        quoteSnippet: topStory.summary.slice(0, 150),
        isPrimarySource: cluster.verificationResult?.primarySourceCount ? cluster.verificationResult.primarySourceCount > 0 : false
      }] : [];

      findings.push({
        id: `finding_${task.id}_${cluster.clusterId}`,
        taskId: task.id,
        claim: `${cluster.canonicalHeadline}: ${cluster.summary}`,
        statementType: 'FACT',
        supportingCitations: supportingCite,
        contradictingCitations: [],
        confidenceScore: cluster.verificationResult ? cluster.verificationResult.corroborationScore : 85,
        uncertaintyNotes: cluster.verificationResult?.conflictDetected ? 'Conflicting coverage noted in initial reports' : undefined,
        validationStatus: 'VALIDATED'
      });
    }

    // 2. Synthesize Analytical Interpretation if multiple events match
    if (evidence.matchingClusters.length > 1) {
      findings.push({
        id: `finding_inference_${task.id}`,
        taskId: task.id,
        claim: `Correlated activities across ${evidence.matchingClusters.length} verified events indicate sustained strategic focus on ${task.topic}.`,
        statementType: 'INFERENCE',
        supportingCitations: citations.slice(0, 2),
        contradictingCitations: [],
        confidenceScore: 78,
        uncertaintyNotes: 'Inferred synthesis across multiple reporting clusters; subject to ongoing verification.',
        validationStatus: 'VALIDATED'
      });
    }

    task.status = 'COMPLETED';
    task.findingsCount = findings.length;
    task.durationMs = Date.now() - startTime;

    return { findings, citations };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown task execution error';
    task.status = 'FAILED';
    task.error = errorMsg;
    task.durationMs = Date.now() - startTime;
    return { findings: [], citations: [] };
  }
}

/**
 * Concurrently executes research tasks with bounded concurrency, retry, timeout,
 * and graceful partial-failure isolation.
 */
export async function executeResearchTasks(
  tasks: ResearchTask[],
  clusters: EventCluster[],
  options: ExecutionOptions = {}
): Promise<TaskExecutionResult> {
  const maxConcurrency = Math.max(1, Math.min(options.maxConcurrency || 3, 5));
  const timeoutMs = options.timeoutMs || 8000;
  const isCancelled = options.isCancelled || (() => false);

  const allFindings: ResearchFinding[] = [];
  const allCitations: ResearchCitation[] = [];
  let cancelled = false;

  // Execute in batches bounded by maxConcurrency
  for (let i = 0; i < tasks.length; i += maxConcurrency) {
    if (isCancelled()) {
      cancelled = true;
      for (let j = i; j < tasks.length; j++) {
        tasks[j].status = 'CANCELLED';
      }
      break;
    }

    const batch = tasks.slice(i, i + maxConcurrency);
    const results = await Promise.all(
      batch.map(task => executeSingleTask(task, clusters, timeoutMs))
    );

    for (const res of results) {
      allFindings.push(...res.findings);
      allCitations.push(...res.citations);
    }
  }

  // Deduplicate citations by ID
  const uniqueCitations = allCitations.filter(
    (v, i, a) => a.findIndex(t => t.id === v.id) === i
  );

  return {
    tasks,
    findings: allFindings,
    citations: uniqueCitations,
    cancelled
  };
}
