'use client';

import React from 'react';
import { ShieldCheck, Cpu, Building2, Flame, TrendingUp } from 'lucide-react';
import { EventCluster } from '@/lib/clustering/types';
import { KnowledgeGraph } from '@/lib/knowledge/types';

interface ExecutiveCommandCenterProps {
  eventClusters: EventCluster[];
  graph: KnowledgeGraph | null;
  onSelectCluster: (cluster: EventCluster) => void;
}

export default function ExecutiveCommandCenter({
  eventClusters,
  graph,
  onSelectCluster
}: ExecutiveCommandCenterProps) {
  const breakingEvents = eventClusters.filter(c => c.breakingState === 'BREAKING');
  const verifiedEventsCount = eventClusters.filter(c => c.verificationResult?.verificationStatus === 'STRONG_CORROBORATION').length;
  const totalPublisherCount = Array.from(new Set(eventClusters.flatMap(c => c.publishers))).length;

  const topEntities = (graph?.nodes || [])
    .filter(n => n.type !== 'EVENT')
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
      
      {/* Widget 1: Critical & Breaking Events */}
      <div 
        onClick={() => breakingEvents[0] && onSelectCluster(breakingEvents[0])}
        className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-2 cursor-pointer hover:border-rose-500/40 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-rose-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            Critical & Breaking ({breakingEvents.length})
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
            URGENT
          </span>
        </div>

        <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">
          {breakingEvents[0]?.canonicalHeadline || 'No active breaking alerts'}
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          {breakingEvents.length > 0
            ? `${breakingEvents.length} rapid breaking events detected by autonomous monitors.`
            : 'All incoming streams operating within baseline parameters.'}
        </p>
      </div>

      {/* Widget 2: Verification Telemetry */}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Corroboration
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">
            {verifiedEventsCount} Verified
          </span>
        </div>

        <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">
          Multi-Source Corroboration Engine
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          Corroborated across {totalPublisherCount} independent primary publishers.
        </p>
      </div>

      {/* Widget 3: Top Organizations & Entities */}
      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-indigo-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Top Organizations
          </span>
          <span className="text-[10px] text-indigo-400 font-bold">
            {topEntities.length} Tracked
          </span>
        </div>

        <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">
          {topEntities.map(e => e.canonicalName).join(' · ') || 'OpenAI · NVIDIA · Google'}
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          Resolved entities automatically extracted from verified evidence streams.
        </p>
      </div>

      {/* Widget 4: Emerging Tech & Graph Nodes */}
      <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-950/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-sky-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Graph Nodes ({graph?.nodes.length || 0})
          </span>
          <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
        </div>

        <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">
          Knowledge Graph Active
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          {graph?.edges.length || 0} directed relationship edges discovered from verified evidence.
        </p>
      </div>

    </div>
  );
}
