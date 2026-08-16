'use client';

import React, { useState } from 'react';
import { Network, Filter, Search, ChevronRight, Share2 } from 'lucide-react';
import { GraphEdge, GraphNode, KnowledgeGraph } from '@/lib/knowledge/types';

interface GraphExplorerProps {
  graph: KnowledgeGraph | null;
  onSelectNode: (node: GraphNode) => void;
}

export default function GraphExplorer({ graph, onSelectNode }: GraphExplorerProps) {
  const [search, setSearch] = useState('');
  const [relationFilter, setRelationFilter] = useState<string>('ALL');

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950 font-mono text-xs text-center text-zinc-500">
        Knowledge Graph initializing... (No nodes or edges generated yet)
      </div>
    );
  }

  const filteredNodes = graph.nodes.filter((node) => {
    if (node.type === 'EVENT') return false; // Filter out raw event nodes to focus on entities
    const matchesSearch = search === '' || node.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const filteredEdges = graph.edges.filter((edge) => {
    return relationFilter === 'ALL' || edge.relation === relationFilter;
  });

  const getRelationBadge = (rel: string) => {
    switch (rel) {
      case 'acquired': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'released': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'partnered': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'located_in': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/80 space-y-4 font-mono text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase">Enterprise Knowledge Graph Explorer</h3>
            <p className="text-[11px] text-zinc-500">
              {graph.nodes.length} NODES · {graph.edges.length} EDGES DISCOVERED FROM EVIDENCE
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search graph entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-700"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* Relationship Filter Badges */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px] pb-1">
        <span className="text-zinc-500 font-bold uppercase flex items-center gap-1">
          <Filter className="w-3 h-3 text-zinc-400" />
          Filter Edge Relation:
        </span>
        {['ALL', 'acquired', 'released', 'partnered', 'mentions', 'located_in'].map((rel) => (
          <button
            key={rel}
            onClick={() => setRelationFilter(rel)}
            className={`px-2 py-0.5 rounded uppercase font-bold transition-colors ${
              relationFilter === rel ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {rel.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Visual Entity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredNodes.slice(0, 9).map((node) => (
          <div
            key={node.id}
            onClick={() => onSelectNode(node)}
            className="p-3.5 rounded-lg border border-zinc-850 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-zinc-900 border border-zinc-800 text-indigo-400 font-bold uppercase">
                {node.type}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {node.clusterCount || 1} Events
              </span>
            </div>

            <h4 className="text-xs font-bold text-zinc-100 font-sans group-hover:text-indigo-300 transition-colors">
              {node.canonicalName}
            </h4>

            {node.aliases && node.aliases.length > 0 && (
              <p className="text-[10px] text-zinc-500 font-sans line-clamp-1">
                Aliases: {node.aliases.join(', ')}
              </p>
            )}

            <div className="pt-1 flex items-center justify-between text-[10px] text-indigo-400 font-bold border-t border-zinc-900/50">
              <span>View Graph Profile</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Relationship Edges Stream */}
      <div className="pt-2 border-t border-zinc-900 space-y-2">
        <h4 className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1">
          <Share2 className="w-3 h-3 text-indigo-400" />
          Evidence-Grounded Relationship Triples ({filteredEdges.length})
        </h4>

        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {filteredEdges.map((edge) => (
            <div key={edge.id} className="p-2 rounded bg-zinc-900/40 border border-zinc-850 flex items-center justify-between text-[11px] font-sans">
              <span className="text-zinc-200 font-bold font-mono">{edge.sourceId.replace('ent_', '')}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getRelationBadge(edge.relation)}`}>
                {edge.relation.replace(/_/g, ' ')}
              </span>
              <span className="text-zinc-200 font-bold font-mono">{edge.targetId.replace('ent_', '').replace('node_', '')}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
