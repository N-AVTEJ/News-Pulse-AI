'use client';

import React from 'react';
import { GitBranch, Shield, Globe, Layers, AlertTriangle } from 'lucide-react';
import { EvidenceGraph } from '@/lib/verification/types';

interface EvidenceGraphVisualizerProps {
  graph?: EvidenceGraph | null;
}

export default function EvidenceGraphVisualizer({ graph }: EvidenceGraphVisualizerProps) {
  if (!graph || !graph.nodes || graph.nodes.length === 0) return null;

  const clusterNode = graph.nodes.find((n) => n.type === 'CLUSTER');
  const sourceNodes = graph.nodes.filter((n) => n.type === 'PRIMARY_SOURCE' || n.type === 'SECONDARY_SOURCE');
  const entityNodes = graph.nodes.filter((n) => n.type === 'ENTITY');

  // Simple layout computation for SVG rendering
  const width = 600;
  const height = 280;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate coordinates for source nodes along top arc
  const sourceCoords = sourceNodes.map((node, index) => {
    const total = sourceNodes.length;
    const angle = (Math.PI / (total + 1)) * (index + 1);
    const radius = 100;
    const x = centerX - radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);
    return { node, x, y };
  });

  // Calculate coordinates for entity nodes along bottom arc
  const entityCoords = entityNodes.map((node, index) => {
    const total = entityNodes.length;
    const angle = (Math.PI / (total + 1)) * (index + 1);
    const radius = 90;
    const x = centerX - radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { node, x, y };
  });

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-indigo-400" />
          Evidence Graph Topology ({graph.nodes.length} Nodes / {graph.edges.length} Edges)
        </span>
        <span className="text-[10px] text-zinc-500">RELATIONAL EVIDENCE MODEL</span>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-x-auto bg-zinc-900/20 rounded border border-zinc-850 p-2 flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {/* Render Edges */}
          {sourceCoords.map((item) => (
            <line
              key={`edge-source-${item.node.id}`}
              x1={centerX}
              y1={centerY}
              x2={item.x}
              y2={item.y}
              stroke={item.node.type === 'PRIMARY_SOURCE' ? '#10b981' : '#38bdf8'}
              strokeWidth="1.5"
              strokeDasharray={item.node.type === 'PRIMARY_SOURCE' ? 'none' : '4 2'}
              opacity="0.6"
            />
          ))}

          {entityCoords.map((item) => (
            <line
              key={`edge-entity-${item.node.id}`}
              x1={centerX}
              y1={centerY}
              x2={item.x}
              y2={item.y}
              stroke="#a855f7"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.4"
            />
          ))}

          {/* Render Root Cluster Node */}
          <g transform={`translate(${centerX}, ${centerY})`}>
            <circle r="22" fill="#18181b" stroke="#6366f1" strokeWidth="2.5" />
            <text textAnchor="middle" dy="4" fill="#a5b4fc" fontSize="9" fontWeight="bold">
              EVENT
            </text>
          </g>

          {/* Render Source Nodes */}
          {sourceCoords.map((item) => (
            <g key={`node-${item.node.id}`} transform={`translate(${item.x}, ${item.y})`}>
              <circle
                r="16"
                fill="#18181b"
                stroke={item.node.type === 'PRIMARY_SOURCE' ? '#10b981' : '#38bdf8'}
                strokeWidth="2"
              />
              <text textAnchor="middle" dy="3" fill="#e4e4e7" fontSize="7" fontWeight="bold">
                {item.node.label.substring(0, 7)}
              </text>
            </g>
          ))}

          {/* Render Entity Nodes */}
          {entityCoords.map((item) => (
            <g key={`node-${item.node.id}`} transform={`translate(${item.x}, ${item.y})`}>
              <circle r="12" fill="#18181b" stroke="#c084fc" strokeWidth="1.5" />
              <text textAnchor="middle" dy="3" fill="#e9d5ff" fontSize="6" fontWeight="bold">
                {item.node.label.substring(0, 6)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-400 pt-1 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Event Cluster
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Primary Source
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sky-500"></span> Secondary Publisher
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span> Entity Node
        </span>
      </div>
    </div>
  );
}
