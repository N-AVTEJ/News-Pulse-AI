'use client';

import React from 'react';
import { Cpu, TrendingUp, Globe, Activity, ArrowDown, ShieldCheck, AlertTriangle } from 'lucide-react';
import { OrchestratorExecutionResult, ScoutResult } from '@/lib/agents/types';

interface OrchestratorVisualizerProps {
  execution: OrchestratorExecutionResult | null;
  isScanning: boolean;
}

export default function OrchestratorVisualizer({ execution, isScanning }: OrchestratorVisualizerProps) {
  const status = isScanning ? 'RUNNING' : execution?.status || 'IDLE';

  const getScoutStatus = (agentId: string): ScoutResult | undefined => {
    return execution?.agentTelemetry.find((a) => a.agentId === agentId);
  };

  const techTele = getScoutStatus('tech-scout');
  const bizTele = getScoutStatus('business-scout');
  const worldTele = getScoutStatus('world-scout');

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 space-y-6">
      
      {/* Orchestrator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            status === 'RUNNING' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
            status === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
            status === 'PARTIAL' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
            status === 'FAILED' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
            'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}>
            <Activity className={`w-5 h-5 ${status === 'RUNNING' ? 'animate-pulse' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold tracking-wider text-zinc-100 uppercase">Scout Orchestrator</h2>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                status === 'RUNNING' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse' :
                status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                status === 'PARTIAL' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}>
                {status}
              </span>
            </div>

            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              Execution ID: <span className="text-zinc-300">{execution?.executionId || 'No active run'}</span>
            </p>
          </div>
        </div>

        {/* Global Pipeline Timing Stats */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 self-start sm:self-auto">
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Processed</span>
            <span className="font-bold text-zinc-200">{execution?.totalStoriesProcessed || 0} stories</span>
          </div>
          <div className="border-l border-zinc-800 pl-4">
            <span className="text-zinc-500 block text-[9px] uppercase">Selected</span>
            <span className="font-bold text-indigo-400">{execution?.totalSelected || 0} candidates</span>
          </div>
          <div className="border-l border-zinc-800 pl-4">
            <span className="text-zinc-500 block text-[9px] uppercase">Latency</span>
            <span className="font-bold text-zinc-200">{execution ? `${execution.durationMs}ms` : '—'}</span>
          </div>
        </div>
      </div>

      {/* Pipeline Flow Connector */}
      <div className="flex justify-center -my-2">
        <ArrowDown className={`w-4 h-4 text-zinc-600 ${isScanning ? 'animate-bounce text-indigo-400' : ''}`} />
      </div>

      {/* Concurrent Scout Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* AI & Tech Scout Node */}
        <div className={`p-4 rounded-lg border transition-all ${
          isScanning ? 'border-indigo-500/40 bg-indigo-500/5' :
          techTele?.status === 'COMPLETED' ? 'border-zinc-800 bg-zinc-900/30' :
          techTele?.status === 'FAILED' ? 'border-rose-500/30 bg-rose-500/5' :
          'border-zinc-850 bg-zinc-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-zinc-200">AI & Tech Scout</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
              isScanning ? 'text-indigo-400 bg-indigo-500/10 animate-pulse' :
              techTele?.status === 'COMPLETED' ? 'text-emerald-400 bg-emerald-500/10' :
              techTele?.status === 'FAILED' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-500'
            }`}>
              {isScanning ? 'RUNNING' : techTele?.status || 'IDLE'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
            <span>Checked: <strong className="text-zinc-300">{techTele?.storiesProcessed || 0}</strong></span>
            <span>Selected: <strong className="text-indigo-400">{techTele?.storiesSelected || 0}</strong></span>
            <span>{techTele ? `${techTele.durationMs}ms` : '—'}</span>
          </div>
        </div>

        {/* Business Scout Node */}
        <div className={`p-4 rounded-lg border transition-all ${
          isScanning ? 'border-indigo-500/40 bg-indigo-500/5' :
          bizTele?.status === 'COMPLETED' ? 'border-zinc-800 bg-zinc-900/30' :
          bizTele?.status === 'FAILED' ? 'border-rose-500/30 bg-rose-500/5' :
          'border-zinc-850 bg-zinc-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-zinc-200">Business Scout</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
              isScanning ? 'text-indigo-400 bg-indigo-500/10 animate-pulse' :
              bizTele?.status === 'COMPLETED' ? 'text-emerald-400 bg-emerald-500/10' :
              bizTele?.status === 'FAILED' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-500'
            }`}>
              {isScanning ? 'RUNNING' : bizTele?.status || 'IDLE'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
            <span>Checked: <strong className="text-zinc-300">{bizTele?.storiesProcessed || 0}</strong></span>
            <span>Selected: <strong className="text-indigo-400">{bizTele?.storiesSelected || 0}</strong></span>
            <span>{bizTele ? `${bizTele.durationMs}ms` : '—'}</span>
          </div>
        </div>

        {/* World News Scout Node */}
        <div className={`p-4 rounded-lg border transition-all ${
          isScanning ? 'border-indigo-500/40 bg-indigo-500/5' :
          worldTele?.status === 'COMPLETED' ? 'border-zinc-800 bg-zinc-900/30' :
          worldTele?.status === 'FAILED' ? 'border-rose-500/30 bg-rose-500/5' :
          'border-zinc-850 bg-zinc-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold text-zinc-200">World News Scout</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
              isScanning ? 'text-indigo-400 bg-indigo-500/10 animate-pulse' :
              worldTele?.status === 'COMPLETED' ? 'text-emerald-400 bg-emerald-500/10' :
              worldTele?.status === 'FAILED' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-500'
            }`}>
              {isScanning ? 'RUNNING' : worldTele?.status || 'IDLE'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
            <span>Checked: <strong className="text-zinc-300">{worldTele?.storiesProcessed || 0}</strong></span>
            <span>Selected: <strong className="text-indigo-400">{worldTele?.storiesSelected || 0}</strong></span>
            <span>{worldTele ? `${worldTele.durationMs}ms` : '—'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
