'use client';

import React from 'react';
import { Cpu, Play, Activity, Database, Clock, ShieldAlert } from 'lucide-react';
import { ScoutResult } from '@/lib/agents/types';

interface AgentCardProps {
  telemetry?: ScoutResult;
  name: string;
  role: string;
  category: string;
  isScanning?: boolean;
  onRunScout?: () => void;
}

export default function AgentCard({ telemetry, name, role, category, isScanning, onRunScout }: AgentCardProps) {
  const status = isScanning ? 'RUNNING' : telemetry?.status || 'IDLE';

  const getStatusConfig = (st: string) => {
    switch (st) {
      case 'RUNNING':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
          dot: 'bg-indigo-500 animate-ping',
          solidDot: 'bg-indigo-500',
          label: 'RUNNING'
        };
      case 'COMPLETED':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          dot: 'hidden',
          solidDot: 'bg-emerald-500',
          label: 'COMPLETED'
        };
      case 'FAILED':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          dot: 'hidden',
          solidDot: 'bg-rose-500',
          label: 'FAILED'
        };
      case 'IDLE':
      default:
        return {
          bg: 'bg-zinc-800/40 border-zinc-800 text-zinc-500',
          dot: 'hidden',
          solidDot: 'bg-zinc-600',
          label: 'IDLE'
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/60">
      {/* Decorative status accent border */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${
        status === 'RUNNING' ? 'bg-indigo-500' :
        status === 'COMPLETED' ? 'bg-emerald-500' :
        status === 'FAILED' ? 'bg-rose-500' : 'bg-zinc-700'
      }`}></div>

      <div className="flex items-start justify-between pl-2">
        <div>
          <h3 className="font-semibold text-sm text-zinc-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>{name}</span>
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500 leading-normal max-w-xs">{role}</p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border tracking-wider ${statusConfig.bg}`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.dot}`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusConfig.solidDot}`}></span>
            </span>
            <span>{statusConfig.label}</span>
          </div>

          {onRunScout && (
            <button 
              onClick={onRunScout}
              disabled={isScanning}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-700/40"
              title="Run Scout Scan"
            >
              <Play className={`w-3 h-3 text-indigo-400 fill-indigo-400 ${isScanning ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Error state alert if present */}
      {telemetry?.error && (
        <div className="mt-3 ml-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{telemetry.error}</span>
        </div>
      )}

      {/* Statistics Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center pl-2">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-1">
            <Database className="w-2.5 h-2.5" /> Processed
          </span>
          <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5">
            {telemetry?.storiesProcessed || 0}
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-zinc-800/80">
          <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-1">
            <Activity className="w-2.5 h-2.5" /> Selected
          </span>
          <span className="text-xs font-mono font-semibold text-indigo-400 mt-0.5">
            {telemetry?.storiesSelected || 0}
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-zinc-800/80">
          <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Latency
          </span>
          <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5">
            {telemetry ? `${telemetry.durationMs}ms` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
