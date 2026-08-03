import { EventCluster } from '../clustering/types';
import { extractEntities } from '../clustering/headlineNormalization';
import { classifySource } from './sourceClassification';
import { EvidenceEdge, EvidenceGraph, EvidenceNode, VerificationResult } from './types';

/**
 * Builds an internal Evidence Graph representing cluster relationships, sources, stories, and entity nodes.
 */
export function buildEvidenceGraph(
  cluster: EventCluster,
  verification: VerificationResult
): EvidenceGraph {
  const nodes: EvidenceNode[] = [];
  const edges: EvidenceEdge[] = [];

  // 1. Root Cluster Node
  const clusterNodeId = `node_cluster_${cluster.clusterId}`;
  nodes.push({
    id: clusterNodeId,
    label: cluster.canonicalHeadline,
    type: 'CLUSTER',
    metadata: {
      storyCount: cluster.storyCount,
      publisherCount: cluster.publisherCount,
      status: verification.verificationStatus
    }
  });

  // 2. Source & Story Nodes
  const addedSourceIds = new Set<string>();
  const stories = cluster.stories || [];

  for (const story of stories) {
    const classification = classifySource(story.sourceName, story.articleUrl);
    const sourceNodeId = `node_source_${story.sourceName.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Add Source Node if not added yet
    if (!addedSourceIds.has(sourceNodeId)) {
      addedSourceIds.add(sourceNodeId);
      nodes.push({
        id: sourceNodeId,
        label: story.sourceName,
        type: classification.isPrimary ? 'PRIMARY_SOURCE' : 'SECONDARY_SOURCE',
        category: classification.category,
        metadata: {
          isPrimary: classification.isPrimary,
          category: classification.category
        }
      });

      // Edge from Cluster to Source
      edges.push({
        id: `edge_${clusterNodeId}_${sourceNodeId}`,
        source: clusterNodeId,
        target: sourceNodeId,
        label: classification.isPrimary ? 'CITES PRIMARY SOURCE' : 'REPORTED BY',
        type: classification.isPrimary ? 'CITES_PRIMARY' : 'REPORTED_BY'
      });
    }

    // Add Story Node
    const storyNodeId = `node_story_${story.id}`;
    nodes.push({
      id: storyNodeId,
      label: story.headline,
      type: 'STORY',
      metadata: {
        url: story.articleUrl,
        publishedAt: story.publishedAt
      }
    });

    // Edge from Source to Story
    edges.push({
      id: `edge_${sourceNodeId}_${storyNodeId}`,
      source: sourceNodeId,
      target: storyNodeId,
      label: 'PUBLISHED ARTICLE',
      type: 'REPORTED_BY'
    });
  }

  // 3. Conflict Edges if conflicts exist
  if (verification.conflictingSources && verification.conflictingSources.length >= 2) {
    for (let i = 0; i < verification.conflictingSources.length - 1; i++) {
      const s1 = verification.conflictingSources[i];
      const s2 = verification.conflictingSources[i + 1];

      edges.push({
        id: `edge_conflict_${s1.id}_${s2.id}`,
        source: `node_story_${s1.id}`,
        target: `node_story_${s2.id}`,
        label: 'CONFLICTS WITH REPORT',
        type: 'CONFLICTS_WITH'
      });
    }
  }

  // 4. Entity Nodes
  const entities = extractEntities(cluster.canonicalHeadline);
  for (const ent of Array.from(entities)) {
    const entityNodeId = `node_entity_${ent}`;
    nodes.push({
      id: entityNodeId,
      label: ent.toUpperCase(),
      type: 'ENTITY'
    });

    edges.push({
      id: `edge_${clusterNodeId}_${entityNodeId}`,
      source: clusterNodeId,
      target: entityNodeId,
      label: 'ASSOCIATED ENTITY',
      type: 'ASSOCIATED_ENTITY'
    });
  }

  return { nodes, edges };
}
