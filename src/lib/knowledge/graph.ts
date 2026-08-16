import { GraphEdge, GraphNode, KnowledgeGraph } from './types';

class InMemoryGraphStore {
  private nodesMap: Map<string, GraphNode> = new Map();
  private edgesMap: Map<string, GraphEdge> = new Map();

  addNode(node: GraphNode): void {
    if (this.nodesMap.has(node.id)) {
      const existing = this.nodesMap.get(node.id)!;
      this.nodesMap.set(node.id, {
        ...existing,
        clusterCount: (existing.clusterCount || 1) + 1,
        aliases: Array.from(new Set([...existing.aliases, ...node.aliases]))
      });
    } else {
      this.nodesMap.set(node.id, { ...node, clusterCount: 1 });
    }
  }

  addEdge(edge: GraphEdge): void {
    if (this.edgesMap.has(edge.id)) {
      const existing = this.edgesMap.get(edge.id)!;
      this.edgesMap.set(edge.id, {
        ...existing,
        evidenceCount: existing.evidenceCount + 1,
        weight: existing.weight + 1,
        supportingClusterIds: Array.from(new Set([...existing.supportingClusterIds, ...edge.supportingClusterIds]))
      });
    } else {
      this.edgesMap.set(edge.id, edge);
    }
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodesMap.get(id);
  }

  getGraph(): KnowledgeGraph {
    return {
      nodes: Array.from(this.nodesMap.values()),
      edges: Array.from(this.edgesMap.values())
    };
  }

  getNeighbors(nodeId: string): { node: GraphNode; edge: GraphEdge }[] {
    const neighbors: { node: GraphNode; edge: GraphEdge }[] = [];
    const edges = Array.from(this.edgesMap.values());

    for (const edge of edges) {
      if (edge.sourceId === nodeId && this.nodesMap.has(edge.targetId)) {
        neighbors.push({ node: this.nodesMap.get(edge.targetId)!, edge });
      } else if (edge.targetId === nodeId && this.nodesMap.has(edge.sourceId)) {
        neighbors.push({ node: this.nodesMap.get(edge.sourceId)!, edge });
      }
    }

    return neighbors;
  }

  clearGraph(): void {
    this.nodesMap.clear();
    this.edgesMap.clear();
  }
}

export const graphStore = new InMemoryGraphStore();
