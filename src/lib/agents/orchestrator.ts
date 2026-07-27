import { NewsStory } from '../news/types';
import { businessScout } from './scouts/businessScout';
import { techScout } from './scouts/techScout';
import { worldScout } from './scouts/worldScout';
import { 
  MergedIntelligenceStory, 
  OrchestratorExecutionResult, 
  OverallRunStatus, 
  ScoutAgent, 
  ScoutConfigOptions, 
  ScoutResult, 
  ScoutStoryResult 
} from './types';

// Central Scout Registry allowing modular addition of future scouts
export const REGISTERED_SCOUTS: ScoutAgent[] = [
  techScout,
  businessScout,
  worldScout
];

/**
 * Generates a unique execution ID for orchestrator runs.
 */
export function generateExecutionId(): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `run_${Date.now()}_${rand}`;
}

/**
 * Merges story results from multiple scouts deterministically by article identity.
 * Preserves matchedScouts, perScoutScores, and combined signals when a story matches multiple scouts.
 */
export function mergeScoutResults(agentResults: ScoutResult[]): MergedIntelligenceStory[] {
  const storyMap = new Map<string, {
    story: NewsStory;
    matchedScouts: Set<string>;
    matchedSignals: Set<string>;
    perScoutScores: Record<string, number>;
    primaryResult: ScoutStoryResult;
  }>();

  for (const agentResult of agentResults) {
    if (agentResult.status === 'FAILED') continue;

    for (const item of agentResult.results) {
      const urlKey = item.story.articleUrl.toLowerCase().trim();

      if (!storyMap.has(urlKey)) {
        storyMap.set(urlKey, {
          story: item.story,
          matchedScouts: new Set([item.scoutId]),
          matchedSignals: new Set(item.matchedSignals),
          perScoutScores: { [item.scoutId]: item.selectionScore },
          primaryResult: item
        });
      } else {
        const existing = storyMap.get(urlKey)!;
        existing.matchedScouts.add(item.scoutId);
        item.matchedSignals.forEach(s => existing.matchedSignals.add(s));
        existing.perScoutScores[item.scoutId] = item.selectionScore;

        // Keep highest scoring result as primary result for breakdown representation
        if (item.selectionScore > existing.primaryResult.selectionScore) {
          existing.primaryResult = item;
        }
      }
    }
  }

  const mergedStories: MergedIntelligenceStory[] = [];

  for (const entry of Array.from(storyMap.values())) {
    const primary = entry.primaryResult;
    const scoutsArray = Array.from(entry.matchedScouts);
    const signalsArray = Array.from(entry.matchedSignals);

    mergedStories.push({
      id: `intel-${entry.story.id}`,
      story: entry.story,
      matchedScouts: scoutsArray,
      matchedSignals: signalsArray,
      perScoutScores: entry.perScoutScores,
      topScore: primary.selectionScore,
      primaryScoutId: primary.scoutId,
      primaryScoutName: primary.scoutName,
      selectionReason: primary.selectionReason,
      scoreBreakdown: primary.scoreBreakdown
    });
  }

  // Sort merged intelligence stories by top selection score descending
  mergedStories.sort((a, b) => b.topScore - a.topScore);

  return mergedStories;
}

/**
 * Main Orchestrator execution function.
 * Concurrently executes registered Scouts using Promise.allSettled.
 */
export async function runScoutOrchestrator(
  stories: NewsStory[],
  config?: ScoutConfigOptions
): Promise<OrchestratorExecutionResult> {
  const executionId = generateExecutionId();
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  console.log(`[Orchestrator] [START] Execution ID: ${executionId} processing ${stories.length} stories across ${REGISTERED_SCOUTS.length} Scouts`);

  // Concurrently execute all Scouts
  const scoutPromises = REGISTERED_SCOUTS.map((scout) => 
    scout.execute(stories, config).catch((err) => {
      // Fallback result in case of unexpected Scout throw
      const errorMsg = err instanceof Error ? err.message : 'Scout exception';
      console.error(`[Orchestrator] [ERROR] Scout ${scout.name} threw error:`, errorMsg);
      
      const failedResult: ScoutResult = {
        agentId: scout.id,
        agentName: scout.name,
        category: scout.category,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: 0,
        storiesProcessed: stories.length,
        storiesSelected: 0,
        status: 'FAILED',
        results: [],
        error: errorMsg
      };
      return failedResult;
    })
  );

  const results = await Promise.allSettled(scoutPromises);

  const agentTelemetry: ScoutResult[] = [];
  let successfulScouts = 0;
  let failedScouts = 0;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const scoutDef = REGISTERED_SCOUTS[i];

    if (res.status === 'fulfilled') {
      agentTelemetry.push(res.value);
      if (res.value.status === 'COMPLETED') {
        successfulScouts++;
      } else {
        failedScouts++;
      }
    } else {
      failedScouts++;
      agentTelemetry.push({
        agentId: scoutDef.id,
        agentName: scoutDef.name,
        category: scoutDef.category,
        startedAt,
        completedAt: new Date().toISOString(),
        durationMs: 0,
        storiesProcessed: stories.length,
        storiesSelected: 0,
        status: 'FAILED',
        results: [],
        error: res.reason ? String(res.reason) : 'Promise rejection'
      });
    }
  }

  // Determine overall status
  let overallStatus: OverallRunStatus = 'SUCCESS';
  if (failedScouts === REGISTERED_SCOUTS.length) {
    overallStatus = 'FAILED';
  } else if (failedScouts > 0) {
    overallStatus = 'PARTIAL';
  }

  // Merge results
  const intelligence = mergeScoutResults(agentTelemetry);

  const durationMs = Date.now() - startTime;
  const completedAt = new Date().toISOString();

  console.log(`[Orchestrator] [COMPLETE] Run ${executionId} finished in ${durationMs}ms with status: ${overallStatus}. Selected ${intelligence.length} intelligence items.`);

  return {
    executionId,
    startedAt,
    completedAt,
    durationMs,
    status: overallStatus,
    totalStoriesProcessed: stories.length,
    totalSelected: intelligence.length,
    agentTelemetry,
    intelligence
  };
}
