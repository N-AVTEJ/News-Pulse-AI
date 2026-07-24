'use client';

import React from 'react';
import { Cpu, Play, Square, Activity, Database, Clock } from 'lucide-react';
import { Agent } from '@/data/mockData';

interface AgentCardProps {
  agent: Agent;
  onToggleStatus: (agentId: string) => void;
}

export default function AgentCard({ agent, onToggleStatus }: AgentCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-500 animate-ping',
          solidDot: 'bg-emerald-500',
          label: 'RUNNING'
        };
      case 'VERIFYING':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          dot: 'bg-amber-500 animate-pulse',
          solidDot: 'bg-amber-500',
          label: 'VERIFYING'
        };
      case 'ANALYZING':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
          dot: 'bg-indigo-400 animate-pulse',
          solidDot: 'bg-indigo-500',
          label: 'ANALYZING'
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

  const statusConfig = getStatusConfig(agent.status);

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/60">
      {/* Decorative vertical bar showing status */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${
        agent.status === 'RUNNING' ? 'bg-emerald-500' :
        agent.status === 'VERIFYING' ? 'bg-amber-500' :
        agent.status === 'ANALYZING' ? 'bg-indigo-500' : 'bg-zinc-700'
      }`}></div>

      <div className="flex items-start justify-between pl-2">
        <div>
          <h3 className="font-semibold text-sm text-zinc-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-500" />
            <span>{agent.name}</span>
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500 leading-normal max-w-xs">{agent.role}</p>
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

          {/* Toggle Control Button */}
          <button 
            onClick={() => onToggleStatus(agent.id)}
            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-700/40"
            title={agent.status === 'IDLE' ? 'Activate Agent' : 'Deactivate Agent (Set IDLE)'}
          >
            {agent.status === 'IDLE' ? (
              <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            ) : (
              <Square className="w-3 h-3 text-rose-400 fill-rose-400" />
            )}
          </button>
        </div>
      </div>

      {/* Task Description */}
      <div className="mt-4 pl-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Current Directive:</span>
        <div className="mt-1 flex items-start gap-1.5 text-xs text-zinc-300 font-mono bg-zinc-950/50 p-2 rounded border border-zinc-900">
          <Activity className="w-3.5 h-3.5 mt-0.5 text-zinc-600 animate-pulse shrink-0" />
          <span className="line-clamp-2">{agent.currentTask}</span>
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center pl-2">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-1">
            <Database className="w-2.5 h-2.5" /> Checked
          </span>
          <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5">{agent.storiesProcessed}</span>
        </div>
        <div className="flex flex-col items-center border-l border-zinc-800/80">
          <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Executed
          </span>
          <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5">{agent.lastExecution}</span>
        </div>
        <div className="flex flex-col items-center border-l border-zinc-800/80">
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Runtime</span>
          <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5">{agent.runtime}</span>
        </div>
      </div>
    </div>
  );
}
