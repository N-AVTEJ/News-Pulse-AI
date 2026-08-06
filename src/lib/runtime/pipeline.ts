import { ingestNews } from '../news/ingest';
import { clusterStories } from '../clustering/clusterEngine';
import { verifyAllClusters } from '../verification/engine';
import { runScoutOrchestratorForClusters } from '../agents/orchestrator';
import { generateAllAnalysisReports } from '../analysis/analysisEngine';
import { detectIncrementalNews } from './incrementalFetcher';
import { detectClusterChanges } from './changeDetector';
import { evaluateAllBreakingEvents } from './breakingDetector';
import { notificationEngine } from './notificationEngine';
import { recordJobFailure, recordRunCompletion } from './healthMonitor';
import { executionHistory } from './executionHistory';
import { workerPool } from './worker';
import { EventCluster } from '../clustering/types';
import { NotificationItem, PipelineJob, PipelineRun, PipelineRunTrigger } from './types';

let previousClustersCache = new Map<string, EventCluster>();

/**
 * Executes the full autonomous pipeline across Stages 1–8.
 */
export async function executeAutonomousPipeline(
  trigger: PipelineRunTrigger = 'MANUAL',
  options: { forceRefresh?: boolean } = {}
): Promise<{
  run: PipelineRun;
  clusters: EventCluster[];
  notifications: NotificationItem[];
}> {
  const startTime = Date.now();
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const jobsExecuted: PipelineJob[] = [];
  const errors: string[] = [];

  let finalClusters: EventCluster[] = [];
  let newNotifications: NotificationItem[] = [];
  let newStoriesCount = 0;
  let updatedClustersCount = 0;

  try {
    // Stage 1: INGESTION
    const { job: job1, result: ingestion } = await workerPool.executeJobStage('INGESTION', async () => {
      return await ingestNews({ forceRefresh: options.forceRefresh });
    });
    jobsExecuted.push(job1);

    // Stage 2: INCREMENTAL_DETECTION
    const { job: job2, result: incremental } = await workerPool.executeJobStage('INCREMENTAL_DETECTION', async () => {
      return detectIncrementalNews(ingestion.stories);
    });
    jobsExecuted.push(job2);
    newStoriesCount = incremental.newStories.length;

    // Stage 3: CLUSTERING
    const { job: job3, result: clustering } = await workerPool.executeJobStage('CLUSTERING', async () => {
      return clusterStories(ingestion.stories);
    });
    jobsExecuted.push(job3);

    // Stage 4: VERIFICATION
    const { job: job4, result: verification } = await workerPool.executeJobStage('VERIFICATION', async () => {
      return verifyAllClusters(clustering.clusters);
    });
    jobsExecuted.push(job4);

    // Stage 5: SCOUTS
    const { job: job5, result: scoutData } = await workerPool.executeJobStage('SCOUTS', async () => {
      return await runScoutOrchestratorForClusters(verification.verifiedClusters, { minCandidateScore: 40 });
    });
    jobsExecuted.push(job5);

    // Stage 6: AI_ANALYSIS
    const { job: job6, result: analysisData } = await workerPool.executeJobStage('AI_ANALYSIS', async () => {
      return await generateAllAnalysisReports(scoutData.enrichedClusters);
    });
    jobsExecuted.push(job6);

    // Stage 7: BREAKING_DETECTION
    const { job: job7, result: breakingClusters } = await workerPool.executeJobStage('BREAKING_DETECTION', async () => {
      return evaluateAllBreakingEvents(analysisData.enrichedClusters);
    });
    jobsExecuted.push(job7);
    finalClusters = breakingClusters;

    // Detect changes compared to previous run
    const delta = detectClusterChanges(finalClusters, previousClustersCache);
    updatedClustersCount = delta.newEvents.length + delta.verificationUpgrades.length;

    // Update previous clusters cache
    previousClustersCache = new Map(finalClusters.map(c => [c.clusterId, c]));

    // Stage 8: NOTIFICATIONS
    const { job: job8, result: notifs } = await workerPool.executeJobStage('NOTIFICATIONS', async () => {
      return notificationEngine.generateNotificationsFromDelta(delta);
    });
    jobsExecuted.push(job8);
    newNotifications = notifs;

    const durationMs = Date.now() - startTime;
    const run: PipelineRun = {
      runId,
      trigger,
      status: 'SUCCESS',
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs,
      jobs: jobsExecuted,
      errors: [],
      newStoriesCount,
      updatedClustersCount,
      notificationsGeneratedCount: newNotifications.length
    };

    recordRunCompletion(durationMs, true);
    executionHistory.logRun(run);

    console.log(`[PipelineLog] [SUCCESS] Pipeline run ${runId} completed in ${durationMs}ms (${newStoriesCount} new stories, ${newNotifications.length} notifications)`);

    return { run, clusters: finalClusters, notifications: newNotifications };

  } catch (err: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMsg = err instanceof Error ? err.message : 'Pipeline execution failure';
    errors.push(errorMsg);
    recordJobFailure();
    recordRunCompletion(durationMs, false);

    const run: PipelineRun = {
      runId,
      trigger,
      status: 'FAILED',
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs,
      jobs: jobsExecuted,
      errors,
      newStoriesCount,
      updatedClustersCount,
      notificationsGeneratedCount: 0
    };

    executionHistory.logRun(run);
    console.error(`[PipelineLog] [FAILED] Pipeline run ${runId} failed after ${durationMs}ms:`, errorMsg);

    return { run, clusters: finalClusters, notifications: [] };
  }
}
