import { EventCluster } from '../clustering/types';
import { resolveEntity } from './entityResolver';
import { graphStore } from './graph';
import { EdgeRelation, GraphEdge, GraphNode, KnowledgeGraph, NodeType } from './types';

/**
 * Builds and populates the Knowledge Graph from verified Event Clusters & AI Reports.
 */
export function buildKnowledgeGraphFromClusters(clusters: EventCluster[]): KnowledgeGraph {
  graphStore.clearGraph();

  for (const cluster of clusters) {
    // 1. Create Event Node
    const eventNodeId = `node_${cluster.clusterId}`;
    const eventNode: GraphNode = {
      id: eventNodeId,
      name: cluster.canonicalHeadline,
      type: 'EVENT',
      canonicalName: cluster.canonicalHeadline,
      aliases: [cluster.canonicalHeadline],
      description: cluster.summary,
      clusterCount: 1
    };
    graphStore.addNode(eventNode);

    // 2. Extract Entities from Cluster & AI Report
    const extracted = cluster.analysisReport?.entities || [];
    for (const ent of extracted) {
      const resolved = resolveEntity(ent.name, ent.category);
      const entityNodeId = resolved.entityId;

      const entityNode: GraphNode = {
        id: entityNodeId,
        name: resolved.canonicalName,
        type: (ent.category as NodeType) || 'COMPANY',
        canonicalName: resolved.canonicalName,
        aliases: resolved.aliases,
        clusterCount: 1
      };
      graphStore.addNode(entityNode);

      // Edge: Entity -> mentions -> Event
      const edgeId = `edge_${entityNodeId}_mentions_${eventNodeId}`;
      const edge: GraphEdge = {
        id: edgeId,
        sourceId: entityNodeId,
        targetId: eventNodeId,
        relation: 'mentions',
        evidenceCount: ent.mentionCount || 1,
        supportingClusterIds: [cluster.clusterId],
        weight: 1
      };
      graphStore.addEdge(edge);
    }

    // 3. Extract Relational Triples from AI Analysis
    const relationships = cluster.analysisReport?.entityRelationships || [];
    for (const rel of relationships) {
      const sourceRes = resolveEntity(rel.subject);
      const targetRes = resolveEntity(rel.object);

      const sourceId = sourceRes.entityId;
      const targetId = targetRes.entityId;

      const edgeRelation = (rel.predicate as EdgeRelation) || 'related_to';
      const edgeId = `edge_${sourceId}_${edgeRelation}_${targetId}`;

      const edge: GraphEdge = {
        id: edgeId,
        sourceId,
        targetId,
        relation: edgeRelation,
        evidenceCount: rel.evidenceCount || 1,
        supportingClusterIds: [cluster.clusterId],
        weight: rel.evidenceCount || 1
      };
      graphStore.addEdge(edge);
    }
  }

  return graphStore.getGraph();
}
