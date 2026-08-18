'use client';

import React, { useState, useEffect } from 'react';
import { X, Activity, Server, Cpu, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { ApplicationMetrics } from '@/lib/observability/metrics';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthData {
  status: string;
  environment: string;
  uptimeSeconds: number;
  memory: { heapUsedMb: number; thresholdMb: number };
  dependencies: Record<string, { status: string; [key: string]: unknown }>;
  metrics: ApplicationMetrics;
  timestamp: string;
}

export default function SystemStatusModal({ isOpen, onClose }: SystemStatusModalProps) {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.error('[SystemStatusModal] Health check fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Operational Diagnostics & System Health</h2>
              <p className="text-[11px] text-zinc-500">LIVENESS · READINESS · DEPENDENCY TELEMETRY · QUEUES</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHealth}
              disabled={isLoading}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {health ? (
          <div className="space-y-6">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/10 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Overall System</span>
                <p className="text-sm font-bold text-zinc-100 font-sans">{health.status}</p>
                <span className="text-[10px] text-zinc-500 font-mono">Env: {health.environment}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-indigo-500/20 bg-indigo-950/10 space-y-1">
                <span className="text-[10px] text-indigo-400 uppercase font-bold">Process Uptime</span>
                <p className="text-sm font-bold text-zinc-100 font-sans">{health.uptimeSeconds}s</p>
                <span className="text-[10px] text-zinc-500 font-mono">Ready: PASS</span>
              </div>

              <div className="p-3.5 rounded-lg border border-sky-500/20 bg-sky-950/10 space-y-1">
                <span className="text-[10px] text-sky-400 uppercase font-bold">Heap Memory</span>
                <p className="text-sm font-bold text-zinc-100 font-sans">{health.memory.heapUsedMb} MB</p>
                <span className="text-[10px] text-zinc-500 font-mono">Threshold: {health.memory.thresholdMb}MB</span>
              </div>

              <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-950/10 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold">Avg Latency</span>
                <p className="text-sm font-bold text-zinc-100 font-sans">{health.metrics.averageResponseLatencyMs} ms</p>
                <span className="text-[10px] text-zinc-500 font-mono">Requests: {health.metrics.totalRequests}</span>
              </div>
            </div>

            {/* Subsystem Dependencies Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                Subsystem Dependencies Health
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(health.dependencies).map(([key, dep]) => (
                  <div key={key} className="p-3.5 rounded-lg border border-zinc-850 bg-zinc-900/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-zinc-100 font-mono uppercase text-xs">{key}</strong>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        dep.status === 'UP' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {dep.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 font-sans space-y-0.5">
                      {Object.entries(dep)
                        .filter(([k]) => k !== 'status')
                        .map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-zinc-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="text-zinc-300 font-mono">{String(v)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Metrics Summary */}
            <div className="p-4 rounded-lg border border-zinc-850 bg-zinc-900/20 space-y-3">
              <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Application Metrics Registry Counters
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 block">STORIES INGESTED</span>
                  <strong className="text-sm text-zinc-100 font-bold">{health.metrics.storiesIngested}</strong>
                </div>

                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 block">CLUSTERS CREATED</span>
                  <strong className="text-sm text-indigo-400 font-bold">{health.metrics.clustersCreated}</strong>
                </div>

                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 block">VERIFICATION JOBS</span>
                  <strong className="text-sm text-emerald-400 font-bold">{health.metrics.verificationJobs}</strong>
                </div>

                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 block">AI REPORTS GENERATED</span>
                  <strong className="text-sm text-sky-400 font-bold">{health.metrics.analysisReportsGenerated}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500 text-xs">
            Loading operational diagnostics...
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
