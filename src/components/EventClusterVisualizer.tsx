'use client';

import React from 'react';
import { Layers, GitMerge, BarChart2, Clock } from 'lucide-react';
import { ClusteringTelemetry } from '@/lib/clustering/types';

interface EventClusterVisualizerProps {
  telemetry?: ClusteringTelemetry | null;
}

export default function EventClusterVisualizer({ telemetry }: EventClusterVisualizerProps) {
  if (!telemetry) return null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          Event Clustering Telemetry
        </span>
        <span className="text-[10px] text-zinc-500">DETERMINISTIC SIMILARITY ENGINE</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-2.5 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Events Created</span>
          <strong className="text-indigo-400 text-sm font-bold">{telemetry.clustersCreated}</strong>
        </div>

        <div className="p-2.5 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Articles Merged</span>
          <strong className="text-emerald-400 text-sm font-bold">{telemetry.storiesMerged}</strong>
        </div>

        <div className="p-2.5 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Avg Cluster Size</span>
          <strong className="text-zinc-200 text-sm font-bold">{telemetry.averageClusterSize} articles</strong>
        </div>

        <div className="p-2.5 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Latency</span>
          <strong className="text-zinc-200 text-sm font-bold">{telemetry.durationMs}ms</strong>
        </div>
      </div>
    </div>
  );
}
