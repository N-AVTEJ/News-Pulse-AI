'use client';

import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import AgentCard from '@/components/AgentCard';
import ActivityFeed from '@/components/ActivityFeed';

export default function AgentsPage() {
  const { agents, activityLogs, toggleAgentStatus } = usePulse();

  const activeCount = agents.filter(a => a.status !== 'IDLE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-indigo-400 font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 animate-pulse" />
            AGENT OPERATIONS COMMAND
          </h1>
          <p className="text-xs text-zinc-500 font-mono">NODE SUITE: ACTIVE // ACTIVE AGENTS: {activeCount}/{agents.length}</p>
        </div>
      </div>

      {/* Grid: 2/3 Agents, 1/3 Operational Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agents Grid (Left - 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-900">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Active Monitoring Scouts & Analysers
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">MANUAL OVERRIDES PERMITTED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <AgentCard 
                key={agent.id}
                agent={agent}
                onToggleStatus={toggleAgentStatus}
              />
            ))}
          </div>
        </div>

        {/* Telemetry Console (Right - 1/3) */}
        <div className="space-y-6">
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-900">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                System Telemetry Logs
              </h2>
            </div>
            
            {/* Embedded Activity stream console */}
            <ActivityFeed logs={activityLogs} />

            {/* Agent Collaboration Protocol explanation */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-[10px] text-zinc-500 space-y-2">
              <span className="font-bold text-zinc-400 block uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                COLLABORATION PROTOCOL:
              </span>
              <p className="leading-relaxed">
                1. <span className="text-zinc-300">Scouts</span> pull raw wire data and insert potential indicators into system buffers.
              </p>
              <p className="leading-relaxed">
                2. <span className="text-zinc-300">Verification Agent</span> performs secondary queries, confirming outlet consensus.
              </p>
              <p className="leading-relaxed">
                3. <span className="text-zinc-300">Ranking Agent</span> weighs systemic index variables.
              </p>
              <p className="leading-relaxed">
                4. <span className="text-zinc-300">Analysis & Summary Agents</span> generate abstracts, chronological milestones, and impact tables.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
