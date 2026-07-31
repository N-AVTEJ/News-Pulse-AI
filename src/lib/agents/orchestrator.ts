import { NewsStory } from '../news/types';
import { EventCluster } from '../clustering/types';
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

export const REGISTERED_SCOUTS: ScoutAgent[] = [
  techScout,
  businessScout,
  worldScout
];

export function generateExecutionId(): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `run_${Date.now()}_${rand}`;
}

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

  mergedStories.sort((a, b) => b.topScore - a.topScore);
  return mergedStories;
}

export async function runScoutOrchestrator(
  stories: NewsStory[],
  config?: ScoutConfigOptions
): Promise<OrchestratorExecutionResult> {
  const executionId = generateExecutionId();
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const scoutPromises = REGISTERED_SCOUTS.map((scout) => 
    scout.execute(stories, config).catch((err) => {
      const errorMsg = err instanceof Error ? err.message : 'Scout exception';
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
  let failedScouts = 0;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const scoutDef = REGISTERED_SCOUTS[i];

    if (res.status === 'fulfilled') {
      agentTelemetry.push(res.value);
      if (res.value.status !== 'COMPLETED') {
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

  let overallStatus: OverallRunStatus = 'SUCCESS';
  if (failedScouts === REGISTERED_SCOUTS.length) {
    overallStatus = 'FAILED';
  } else if (failedScouts > 0) {
    overallStatus = 'PARTIAL';
  }

  const intelligence = mergeScoutResults(agentTelemetry);

  return {
    executionId,
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    status: overallStatus,
    totalStoriesProcessed: stories.length,
    totalSelected: intelligence.length,
    agentTelemetry,
    intelligence
  };
}

/**
 * Concurrently executes Scouts over EventClusters and attaches Scout metadata directly to the EventClusters.
 */
export async function runScoutOrchestratorForClusters(
  clusters: EventCluster[],
  config?: ScoutConfigOptions
): Promise<{ executionResult: OrchestratorExecutionResult; enrichedClusters: EventCluster[] }> {
  const executionId = generateExecutionId();
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const scoutPromises = REGISTERED_SCOUTS.map((scout) => {
    if (scout.executeClusters) {
      return scout.executeClusters(clusters, config);
    }
    return scout.execute(clusters.map(c => c.stories[0]), config);
  }).map(p => p.catch((err) => {
    const errorMsg = err instanceof Error ? err.message : 'Scout cluster exception';
    return {
      agentId: 'failed-scout',
      agentName: 'Failed Scout',
      category: 'world' as const,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 0,
      storiesProcessed: clusters.length,
      storiesSelected: 0,
      status: 'FAILED' as const,
      results: [],
      error: errorMsg
    };
  }));

  const results = await Promise.allSettled(scoutPromises);
  const agentTelemetry: ScoutResult[] = [];
  let failedScouts = 0;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const scoutDef = REGISTERED_SCOUTS[i];

    if (res.status === 'fulfilled') {
      agentTelemetry.push(res.value);
      if (res.value.status !== 'COMPLETED') {
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
        storiesProcessed: clusters.length,
        storiesSelected: 0,
        status: 'FAILED',
        results: [],
        error: res.reason ? String(res.reason) : 'Promise rejection'
      });
    }
  }

  // Enrich EventClusters with Scout detections
  const enrichedClusters = clusters.map((cluster) => {
    const matchedScoutsSet = new Set<string>();
    const matchedSignalsSet = new Set<string>();
    const perScoutScores: Record<string, number> = {};
    let topScore = 0;
    let bestReason = '';

    for (const telemetry of agentTelemetry) {
      if (telemetry.status === 'FAILED') continue;

      for (const item of telemetry.results) {
        if (item.clusterId === cluster.clusterId || item.story.id === cluster.stories[0].id) {
          matchedScoutsSet.add(item.scoutId);
          item.matchedSignals.forEach(s => matchedSignalsSet.add(s));
          perScoutScores[item.scoutId] = item.selectionScore;

          if (item.selectionScore > topScore) {
            topScore = item.selectionScore;
            bestReason = item.selectionReason;
          }
        }
      }
    }

    return {
      ...cluster,
      matchedScouts: Array.from(matchedScoutsSet),
      matchedSignals: Array.from(matchedSignalsSet),
      perScoutScores,
      topSelectionScore: topScore,
      selectionReason: bestReason || cluster.selectionReason
    };
  });

  let overallStatus: OverallRunStatus = 'SUCCESS';
  if (failedScouts === REGISTERED_SCOUTS.length) {
    overallStatus = 'FAILED';
  } else if (failedScouts > 0) {
    overallStatus = 'PARTIAL';
  }

  const intelligence = mergeScoutResults(agentTelemetry);

  const totalStories = clusters.reduce((acc, c) => acc + c.storyCount, 0);

  const executionResult: OrchestratorExecutionResult = {
    executionId,
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    status: overallStatus,
    totalStoriesProcessed: totalStories,
    totalSelected: enrichedClusters.filter(c => c.matchedScouts.length > 0).length,
    agentTelemetry,
    intelligence,
    eventClusters: enrichedClusters
  };

  return { executionResult, enrichedClusters };
}
