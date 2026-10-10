import { EventCluster } from '@/lib/clustering/types';
import { NewsStory } from '@/lib/news/types';
import { graphStore } from '@/lib/knowledge/graph';
import { GraphNode, GraphEdge } from '@/lib/knowledge/types';
import { ResearchTask, ResearchCitation } from './types';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';

export interface RetrievedEvidence {
  taskId: string;
  matchingClusters: EventCluster[];
  matchingStories: NewsStory[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  citations: ResearchCitation[];
  totalEvidenceCount: number;
}

/**
 * Searches and indexes evidence for a research task.
 * Prioritizes existing NewsPulse data (Event Clusters, Articles, Knowledge Graph).
 * Only uses configured, permitted connectors (via ingestNews) if cluster count is below threshold.
 */
export async function retrieveEvidenceForTask(
  task: ResearchTask,
  preloadedClusters?: EventCluster[]
): Promise<RetrievedEvidence> {
  let clusters: EventCluster[] = preloadedClusters || [];

  // If no clusters provided, use existing ingestion pipeline with permitted sources
  if (clusters.length === 0) {
    try {
      const ingestion = await ingestNews();
      const clustered = clusterStories(ingestion.stories);
      const verified = verifyAllClusters(clustered.clusters);
      clusters = verified.verifiedClusters;
    } catch (err) {
      console.warn(`[EvidenceRetriever] Failed to ingest fresh news for task ${task.id}:`, err);
    }
  }

  const queryTerms = task.question
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['what', 'when', 'where', 'which', 'about', 'potential', 'consequences'].includes(w));

  const targetEntitiesLower = task.targetEntities.map(e => e.toLowerCase());

  // 1. Rank & Filter Matching Clusters
  const matchingClusters: EventCluster[] = [];
  const matchingStories: NewsStory[] = [];
  const citations: ResearchCitation[] = [];

  for (const cluster of clusters) {
    let matchScore = 0;
    const headlineLower = cluster.canonicalHeadline.toLowerCase();
    const summaryLower = cluster.summary.toLowerCase();

    // Entity matching
    for (const ent of targetEntitiesLower) {
      if (headlineLower.includes(ent) || summaryLower.includes(ent) || (cluster.resolvedEntities || []).some(re => re.toLowerCase().includes(ent))) {
        matchScore += 4;
      }
    }

    // Keyword matching
    for (const term of queryTerms) {
      if (headlineLower.includes(term)) matchScore += 2;
      else if (summaryLower.includes(term)) matchScore += 1;
    }

    if (matchScore > 0) {
      matchingClusters.push(cluster);

      // Extract original stories with preserved URLs and timestamps
      for (const story of cluster.stories || []) {
        matchingStories.push(story);

        // Generate verified citation reference
        citations.push({
          id: `cite_${story.id}`,
          storyId: story.id,
          clusterId: cluster.clusterId,
          publisherName: story.sourceName,
          sourceUrl: story.sourceUrl,
          articleUrl: story.articleUrl,
          headline: story.headline,
          publishedAt: story.publishedAt,
          quoteSnippet: story.summary.slice(0, 150),
          isPrimarySource: cluster.verificationResult?.primarySourceCount ? cluster.verificationResult.primarySourceCount > 0 : false
        });
      }
    }
  }

  // 2. Query Knowledge Graph
  const graphNodes: GraphNode[] = [];
  const graphEdges: GraphEdge[] = [];

  for (const entityName of task.targetEntities) {
    const directNode = graphStore.getNode(entityName) || graphStore.getGraph().nodes.find(n => n.canonicalName.toLowerCase() === entityName.toLowerCase());
    if (directNode) {
      graphNodes.push(directNode);
      const neighbors = graphStore.getNeighbors(directNode.id);
      for (const n of neighbors) {
        if (!graphNodes.some(existing => existing.id === n.node.id)) {
          graphNodes.push(n.node);
        }
        if (!graphEdges.some(existing => existing.id === n.edge.id)) {
          graphEdges.push(n.edge);
        }
      }
    }
  }

  return {
    taskId: task.id,
    matchingClusters,
    matchingStories,
    graphNodes,
    graphEdges,
    citations,
    totalEvidenceCount: matchingStories.length + graphNodes.length
  };
}
