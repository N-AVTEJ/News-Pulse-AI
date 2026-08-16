'use client';

import React from 'react';
import { X, Network, Share2, Layers, Tag, ChevronRight } from 'lucide-react';
import { GraphEdge, GraphNode } from '@/lib/knowledge/types';
import { EventCluster } from '@/lib/clustering/types';

interface EntityProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: GraphNode | null;
  neighbors: { node: GraphNode; edge: GraphEdge }[];
  relatedClusters: EventCluster[];
  onSelectCluster?: (cluster: EventCluster) => void;
}

export default function EntityProfileModal({
  isOpen,
  onClose,
  node,
  neighbors,
  relatedClusters,
  onSelectCluster
}: EntityProfileModalProps) {
  if (!isOpen || !node) return null;

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'COMPANY': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'PERSON': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'TECHNOLOGY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ORGANIZATION': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeBadgeColor(node.type)}`}>
                  {node.type}
                </span>
                <h2 className="text-lg font-bold text-zinc-100 font-sans">{node.canonicalName}</h2>
              </div>
              <p className="text-xs text-zinc-500 uppercase mt-0.5">RESOLVED ENTITY PROFILE // ID: {node.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aliases */}
        {node.aliases && node.aliases.length > 0 && (
          <div className="space-y-1.5 border-b border-zinc-900 pb-4 text-xs">
            <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
              <Tag className="w-3 h-3 text-zinc-400" />
              Preserved Aliases ({node.aliases.length}):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {node.aliases.map(alias => (
                <span key={alias} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-300 text-[11px]">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Connected Graph Relationships */}
        <div className="space-y-3 border-b border-zinc-900 pb-4">
          <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-indigo-400" />
            Connected Entity Relationships ({neighbors.length})
          </h3>

          {neighbors.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No direct node connections established yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {neighbors.map(({ node: n, edge }) => (
                <div key={edge.id} className="p-3 rounded-lg border border-zinc-850 bg-zinc-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">
                      [{edge.relation.replace(/_/g, ' ')}]
                    </span>
                    <span className="text-[9px] text-zinc-500">
                      Weight: {edge.weight}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-100 font-sans">{n.canonicalName}</h4>
                  <span className="text-[10px] text-zinc-500 uppercase">{n.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Verified Event Clusters */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            Related Event Clusters ({relatedClusters.length})
          </h3>

          {relatedClusters.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No active event clusters directly linked.
            </div>
          ) : (
            <div className="space-y-2">
              {relatedClusters.map((cluster) => (
                <div 
                  key={cluster.clusterId} 
                  onClick={() => onSelectCluster && onSelectCluster(cluster)}
                  className="p-3 rounded-lg border border-zinc-850 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">{cluster.canonicalHeadline}</h4>
                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">{cluster.summary}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Entity Profile
          </button>
        </div>
      </div>
    </div>
  );
}
