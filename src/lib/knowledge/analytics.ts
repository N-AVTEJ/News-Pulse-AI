import { EventCluster } from '../clustering/types';
import { graphStore } from './graph';

export interface ExecutiveAnalytics {
  totalNodes: number;
  totalEdges: number;
  nodeTypeCounts: Record<string, number>;
  edgeRelationCounts: Record<string, number>;
  topConnectedEntities: { name: string; type: string; count: number }[];
}

export function getExecutiveGraphAnalytics(clusters: EventCluster[]): ExecutiveAnalytics {
  const graph = graphStore.getGraph();
  const nodeTypeCounts: Record<string, number> = {};
  const edgeRelationCounts: Record<string, number> = {};

  for (const node of graph.nodes) {
    nodeTypeCounts[node.type] = (nodeTypeCounts[node.type] || 0) + 1;
  }

  for (const edge of graph.edges) {
    edgeRelationCounts[edge.relation] = (edgeRelationCounts[edge.relation] || 0) + 1;
  }

  const topConnectedEntities = graph.nodes
    .filter(n => n.type !== 'EVENT')
    .map(n => ({
      name: n.name,
      type: n.type,
      count: graphStore.getNeighbors(n.id).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    nodeTypeCounts,
    edgeRelationCounts,
    topConnectedEntities
  };
}
