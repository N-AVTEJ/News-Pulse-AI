'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Cpu, DollarSign, Activity, Route } from 'lucide-react';
import { ModelDefinition, QualityGateResult, ModelTelemetryEntry, EvaluationSummaryMetrics, RegressionBenchmark } from '@/lib/ai/types';

interface AIQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIQualityModal({ isOpen, onClose }: AIQualityModalProps) {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'MODELS' | 'ROUTER' | 'REGRESSIONS'>('METRICS');
  const [models, setModels] = useState<ModelDefinition[]>([]);
  const [metrics, setMetrics] = useState<EvaluationSummaryMetrics | null>(null);
  const [telemetry, setTelemetry] = useState<ModelTelemetryEntry[]>([]);
  const [regressions, setRegressions] = useState<RegressionBenchmark[]>([]);
  const [selectedTaskType, setSelectedTaskType] = useState('DEEP_ANALYSIS');
  const [routeResult, setRouteResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/ai/models')
      .then(res => res.json())
      .then(data => setModels(data.models || []))
      .catch(console.error);

    fetch('/api/ai/telemetry')
      .then(res => res.json())
      .then(data => {
        setMetrics(data.metrics || null);
        setTelemetry(data.telemetry || []);
        setRegressions(data.regressions || []);
      })
      .catch(console.error);
  }, [isOpen]);

  const handleTestRoute = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskType: selectedTaskType, contextLengthChars: 3500 })
      });
      const data = await res.json();
      setRouteResult(data.decision);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 text-xs text-zinc-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">AI Evaluation, Routing & Quality Gate</h2>
              <p className="text-[11px] text-zinc-500">GROUNDING VERIFICATION · CITATION AUDIT · COST TELEMETRY · MODEL ROUTER</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-zinc-900 pb-3">
          {(['METRICS', 'MODELS', 'ROUTER', 'REGRESSIONS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
            >
              {tab === 'METRICS' && 'Quality Overview'}
              {tab === 'MODELS' && 'Model Catalog'}
              {tab === 'ROUTER' && 'Task Router'}
              {tab === 'REGRESSIONS' && 'Regressions Benchmark'}
            </button>
          ))}
        </div>

        {/* Tab 1: METRICS */}
        {activeTab === 'METRICS' && (
          <div className="space-y-6">
            {metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/10 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold">Publish Rate</span>
                  <p className="text-xl font-bold text-zinc-100">{metrics.publishRate}%</p>
                  <span className="text-[10px] text-zinc-500">Passed Quality Gate</span>
                </div>

                <div className="p-3.5 rounded-lg border border-indigo-500/20 bg-indigo-950/10 space-y-1">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold">Avg Grounding</span>
                  <p className="text-xl font-bold text-zinc-100">{metrics.avgGroundingScore}/100</p>
                  <span className="text-[10px] text-zinc-500">Source Token Overlap</span>
                </div>

                <div className="p-3.5 rounded-lg border border-sky-500/20 bg-sky-950/10 space-y-1">
                  <span className="text-[10px] text-sky-400 uppercase font-bold">Citation Score</span>
                  <p className="text-xl font-bold text-zinc-100">{metrics.avgCitationScore}/100</p>
                  <span className="text-[10px] text-zinc-500">Verified Quote Alignment</span>
                </div>

                <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-950/10 space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold">Total Cost (USD)</span>
                  <p className="text-xl font-bold text-zinc-100">${metrics.totalCostUsd}</p>
                  <span className="text-[10px] text-zinc-500">{metrics.totalTokensUsed} tokens</span>
                </div>
              </div>
            )}

            {/* Recent Telemetry Runs */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                Live Model Telemetry & Token Logs
              </h3>

              <div className="border border-zinc-850 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Model</th>
                      <th className="p-2.5">Task</th>
                      <th className="p-2.5">Latency</th>
                      <th className="p-2.5">Tokens</th>
                      <th className="p-2.5">Cost (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {telemetry.map(t => (
                      <tr key={t.id} className="hover:bg-zinc-900/40">
                        <td className="p-2.5 text-zinc-500">{new Date(t.timestamp).toLocaleTimeString()}</td>
                        <td className="p-2.5 font-bold text-indigo-300">{t.modelId}</td>
                        <td className="p-2.5 text-zinc-400">{t.taskType}</td>
                        <td className="p-2.5 text-zinc-300">{t.latencyMs}ms</td>
                        <td className="p-2.5 text-zinc-300">{t.totalTokens}</td>
                        <td className="p-2.5 text-emerald-400 font-mono">${t.costUsd.toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MODELS */}
        {activeTab === 'MODELS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {models.map(m => (
              <div key={m.id} className="p-4 rounded-lg border border-zinc-850 bg-zinc-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-100 font-sans">{m.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                    m.tier === 'REASONING' ? 'bg-purple-950/40 text-purple-300 border-purple-500/30' :
                    m.tier === 'FAST' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' :
                    m.tier === 'BALANCED' ? 'bg-sky-950/40 text-sky-300 border-sky-500/30' :
                    'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}>
                    {m.tier}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="text-zinc-200">{m.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Context Window:</span>
                    <span className="text-zinc-200">{m.contextWindow.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Typical Latency:</span>
                    <span className="text-zinc-200">{m.typicalLatencyMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input / 1k Tokens:</span>
                    <span className="text-emerald-400">${m.inputCostPer1kTokens}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: ROUTER */}
        {activeTab === 'ROUTER' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-zinc-850 bg-zinc-900/30 space-y-3">
              <h3 className="text-xs font-bold text-zinc-100 uppercase flex items-center gap-1.5">
                <Route className="w-4 h-4 text-indigo-400" />
                Dynamic Task-Based Model Routing Engine
              </h3>
              <p className="text-zinc-400 text-[11px]">
                Routes incoming intelligence workloads to optimal model tiers balancing reasoning depth, latency, and token economics.
              </p>

              <div className="flex gap-2 items-center">
                <select
                  value={selectedTaskType}
                  onChange={(e) => setSelectedTaskType(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="DEEP_ANALYSIS">DEEP_ANALYSIS (Cross-source synthesis)</option>
                  <option value="CLAIM_EXTRACTION">CLAIM_EXTRACTION (Atomic fact checking)</option>
                  <option value="SUMMARY">SUMMARY (High-throughput digest)</option>
                  <option value="CLASSIFICATION">CLASSIFICATION (Category & topics)</option>
                </select>

                <button
                  onClick={handleTestRoute}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                >
                  {isLoading ? 'Routing...' : 'Evaluate Route Decision'}
                </button>
              </div>

              {routeResult && (
                <div className="mt-4 p-3 rounded bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-400 font-bold">Selected Model:</span>
                    <span className="text-zinc-100 font-bold">{routeResult.selectedModel.name} ({routeResult.selectedModel.tier})</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Rationale:</span>
                    <span className="text-zinc-300">{routeResult.reason}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Est. Cost:</span>
                    <span className="text-emerald-400 font-mono">${routeResult.estimatedCostUsd.toFixed(6)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: REGRESSIONS */}
        {activeTab === 'REGRESSIONS' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Golden Benchmark Regression Suite
            </h3>
            <p className="text-zinc-400 text-[11px]">
              Compares current prompt and model outputs against established baseline evaluation scores to prevent intelligence drift.
            </p>

            <div className="border border-zinc-850 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Benchmark Headline</th>
                    <th className="p-2.5">Baseline</th>
                    <th className="p-2.5">Current</th>
                    <th className="p-2.5">Delta</th>
                    <th className="p-2.5">Model</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {regressions.map(r => (
                    <tr key={r.id} className="hover:bg-zinc-900/40">
                      <td className="p-2.5 text-zinc-200 font-sans font-medium">{r.clusterHeadline}</td>
                      <td className="p-2.5 text-zinc-400">{r.baselineScore}</td>
                      <td className="p-2.5 text-zinc-100 font-bold">{r.lastEvaluatedScore}</td>
                      <td className={`p-2.5 font-bold ${r.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {r.scoreDelta >= 0 ? `+${r.scoreDelta}` : r.scoreDelta}
                      </td>
                      <td className="p-2.5 text-indigo-300">{r.modelId} (v{r.promptVersion})</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          r.isRegressed ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {r.isRegressed ? 'REGRESSED' : 'STABLE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close AI Quality Console
          </button>
        </div>
      </div>
    </div>
  );
}
