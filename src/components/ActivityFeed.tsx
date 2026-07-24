'use client';

import React from 'react';
import { Terminal, Shield, Sparkles } from 'lucide-react';
import { ActivityLog } from '@/data/mockData';

interface ActivityFeedProps {
  logs: ActivityLog[];
}

export default function ActivityFeed({ logs }: ActivityFeedProps) {
  const getLogTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400 font-medium';
      case 'warning':
        return 'text-amber-400 font-medium';
      case 'error':
        return 'text-rose-400 font-bold';
      case 'info':
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-zinc-800 bg-zinc-950/60 backdrop-blur-md overflow-hidden">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/40 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Agent Operations Stream</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-medium text-indigo-400">
          <Shield className="w-3 h-3" />
          <span>SECURE PROTOCOL</span>
        </div>
      </div>

      {/* Feed Messages */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-3 max-h-[350px] min-h-[250px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 py-10">
            <Sparkles className="w-5 h-5 mb-2 opacity-50" />
            <span>Awaiting telemetry transmissions...</span>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="group border-b border-zinc-900/40 pb-2.5 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-600">[{log.timestamp}]</span>
                <span className="text-indigo-400 font-semibold uppercase hover:underline cursor-pointer">{log.agentName}</span>
                <span className="text-zinc-500 font-semibold">:</span>
                <span className={getLogTypeStyles(log.type)}>{log.message}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feed Terminal Footer Status */}
      <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-2 flex items-center justify-between text-[9px] font-mono text-zinc-600 uppercase">
        <span>Channel: Pulse-Intel-Bus-01</span>
        <span>Auto-syncing: ACTIVE</span>
      </div>
    </div>
  );
}
