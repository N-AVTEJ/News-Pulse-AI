import { NewsCategory, NewsStory } from '../news/types';
import { selectCanonicalHeadline, selectClusterSummary } from './canonicalHeadline';
import { calculateStorySimilarity } from './similarityEngine';
import { ClusterConfig, ClusteringTelemetry, EventCluster } from './types';

/**
 * Generates a unique deterministic ID for an EventCluster.
 */
export function generateClusterId(primaryStoryId: string): string {
  return `evt_${primaryStoryId.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

/**
 * Main Story Clustering Engine.
 * Converts isolated NewsStory items into unified EventCluster objects.
 */
export function clusterStories(
  stories: NewsStory[],
  config?: ClusterConfig
): { clusters: EventCluster[]; telemetry: ClusteringTelemetry } {
  const startTime = Date.now();
  const minThreshold = config?.minSimilarityThreshold ?? 50;

  const clusterMap: Map<string, {
    primaryStory: NewsStory;
    stories: NewsStory[];
    bestReason: string;
    bestBreakdown: any;
  }> = new Map();

  for (const story of stories) {
    let matchedClusterId: string | null = null;
    let highestSimilarity = 0;
    let bestMatchReason = '';
    let bestMatchBreakdown = null;

    // Compare story against existing cluster primary stories
    for (const [cId, clusterData] of Array.from(clusterMap.entries())) {
      const { similarityScore, breakdown, reason } = calculateStorySimilarity(story, clusterData.primaryStory);

      if (similarityScore >= minThreshold && similarityScore > highestSimilarity) {
        highestSimilarity = similarityScore;
        matchedClusterId = cId;
        bestMatchReason = reason;
        bestMatchBreakdown = breakdown;
      }
    }

    if (matchedClusterId && clusterMap.has(matchedClusterId)) {
      // Merge story into existing cluster
      const existing = clusterMap.get(matchedClusterId)!;
      existing.stories.push(story);
    } else {
      // Create new cluster
      const newClusterId = generateClusterId(story.id);
      clusterMap.set(newClusterId, {
        primaryStory: story,
        stories: [story],
        bestReason: 'Primary event anchor story',
        bestBreakdown: {
          headlineSimilarity: 40,
          entityOverlap: 30,
          timeProximity: 20,
          categoryMatch: 10,
          totalScore: 100
        }
      });
    }
  }

  // Construct EventCluster objects
  const clusters: EventCluster[] = [];
  let largestSize = 0;
  let totalMergedCount = 0;

  for (const [cId, data] of Array.from(clusterMap.entries())) {
    // Sort stories chronologically (earliest first) for Event Timeline
    const sortedStories = [...data.stories].sort((a, b) => {
      const timeA = new Date(a.publishedAt).getTime();
      const timeB = new Date(b.publishedAt).getTime();
      return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
    });

    // Extract unique publisher names
    const publishers = Array.from(new Set(sortedStories.map(s => s.sourceName)));

    const firstPublished = sortedStories[0].publishedAt;
    const latestPublished = sortedStories[sortedStories.length - 1].publishedAt;

    const canonicalHeadline = selectCanonicalHeadline(sortedStories);
    const summary = selectClusterSummary(sortedStories);

    // Determine primary category
    const primaryCategory: NewsCategory = sortedStories[0].category;

    if (sortedStories.length > largestSize) {
      largestSize = sortedStories.length;
    }
    if (sortedStories.length > 1) {
      totalMergedCount += (sortedStories.length - 1);
    }

    const clusterReason = sortedStories.length > 1 
      ? `Grouped ${sortedStories.length} articles across ${publishers.length} publishers (${data.bestReason})`
      : `Single-publisher event story from ${publishers[0]}`;

    clusters.push({
      clusterId: cId,
      canonicalHeadline,
      summary,
      primaryCategory,
      stories: sortedStories,
      publishers,
      storyCount: sortedStories.length,
      publisherCount: publishers.length,
      firstPublished,
      latestPublished,
      matchedScouts: [],
      matchedSignals: [],
      perScoutScores: {},
      topSelectionScore: 0,
      selectionReason: '',
      status: 'ACTIVE',
      clusterReason,
      clusterBreakdown: data.bestBreakdown,
      importanceScore: null,
      verificationScore: null
    });
  }

  // Sort clusters by latest published timestamp descending
  clusters.sort((a, b) => {
    const timeA = new Date(a.latestPublished).getTime();
    const timeB = new Date(b.latestPublished).getTime();
    return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
  });

  const durationMs = Date.now() - startTime;
  const telemetry: ClusteringTelemetry = {
    totalStoriesProcessed: stories.length,
    clustersCreated: clusters.length,
    storiesMerged: totalMergedCount,
    largestClusterSize: largestSize,
    averageClusterSize: stories.length > 0 ? parseFloat((stories.length / clusters.length).toFixed(1)) : 0,
    durationMs
  };

  console.log(`[ClusteringLog] [COMPLETE] Processed ${stories.length} stories into ${clusters.length} EventClusters (${totalMergedCount} merged) in ${durationMs}ms`);

  return { clusters, telemetry };
}
