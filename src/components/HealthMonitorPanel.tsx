'use client';

import React, { useState, useEffect } from 'react';
import { X, Activity, Search, RefreshCw } from 'lucide-react';
import { HealthMetrics, PipelineRun } from '@/lib/runtime/types';

interface HealthMonitorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  health?: HealthMetrics | null;
}

export default function HealthMonitorPanel({ isOpen, onClose, health }: HealthMonitorPanelProps) {
  const [history, setHistory] = useState<PipelineRun[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadHistory() {
      setIsLoading(true);
      try {
        const url = searchQuery ? `/api/runtime/history?q=${encodeURIComponent(searchQuery)}` : '/api/runtime/history';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setHistory(data.history || []);
          }
        }
      } catch (err: unknown) {
        console.error('[HealthMonitorPanel] Failed to fetch history:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [isOpen, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">System Health & Pipeline Telemetry</h2>
              <p className="text-xs text-zinc-500">RUNTIME MONITOR // SEARCHABLE PIPELINE EXECUTION LOGS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health Metrics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-zinc-900/40 border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Scheduler Status</span>
            <strong className="text-emerald-400 font-bold text-sm">
              {health?.schedulerActive ? 'ACTIVE' : 'INACTIVE'} ({health?.schedulerMode || 'INTERVAL'})
            </strong>
          </div>

          <div className="p-3 rounded bg-zinc-900/40 border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Source Availability</span>
            <strong className="text-emerald-400 font-bold text-sm">
              {health?.sourceAvailabilityPercentage ?? 100}%
            </strong>
          </div>

          <div className="p-3 rounded bg-zinc-900/40 border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Average Run Latency</span>
            <strong className="text-indigo-400 font-bold text-sm">
              {health?.averageExecutionTimeMs || 0}ms
            </strong>
          </div>

          <div className="p-3 rounded bg-zinc-900/40 border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Runs Completed</span>
            <strong className="text-zinc-200 font-bold text-sm">
              {health?.totalRunsCompleted || 0} Runs
            </strong>
          </div>
        </div>

        {/* Searchable Execution History Section */}
        <div className="space-y-3 pt-2 border-t border-zinc-900">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-xs font-bold uppercase text-zinc-300">Searchable Pipeline Run History</h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search run ID, trigger, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading execution logs...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No pipeline execution logs recorded yet. Run a manual pipeline run to generate history.
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-850 rounded-lg bg-zinc-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/50 border-b border-zinc-850 text-[10px] text-zinc-400 uppercase">
                  <tr>
                    <th className="p-3 font-bold">Run ID</th>
                    <th className="p-3 font-bold">Trigger</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold">Duration</th>
                    <th className="p-3 font-bold">Stages</th>
                    <th className="p-3 font-bold">New Content</th>
                    <th className="p-3 font-bold">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 font-mono text-[11px]">
                  {history.map((run) => (
                    <tr key={run.runId} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-3 text-indigo-400 font-bold">{run.runId}</td>
                      <td className="p-3 text-zinc-300">{run.trigger}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          run.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400">{run.durationMs}ms</td>
                      <td className="p-3 text-zinc-300">{run.jobs?.length || 0} Stages</td>
                      <td className="p-3 text-zinc-300">{run.newStoriesCount} Stories</td>
                      <td className="p-3 text-zinc-500">{new Date(run.completedAt || run.startedAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Telemetry Panel
          </button>
        </div>
      </div>
    </div>
  );
}
