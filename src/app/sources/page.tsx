'use client';

import React, { useState } from 'react';
import { Database, Search, ShieldCheck, CheckCircle2, RefreshCw, AlertTriangle, Terminal, Clock } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import { SOURCES_REGISTRY } from '@/lib/news/sources';

export default function SourcesPage() {
  const { sourceStatus, stories, triggerManualScan, isScanning } = usePulse();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Combine static config registry with live health status
  const combinedSources = SOURCES_REGISTRY.map((config) => {
    const liveStatus = sourceStatus.find((s) => s.sourceId === config.id);
    const count = stories.filter((s) => s.sourceName === config.name).length;

    return {
      ...config,
      status: liveStatus?.status || 'UNKNOWN',
      storiesRetrieved: count || liveStatus?.storiesRetrieved || 0,
      fetchDurationMs: liveStatus?.fetchDurationMs || 0,
      lastSuccessAt: liveStatus?.lastSuccessAt || 'Pending check',
      lastError: liveStatus?.lastError
    };
  });

  const filteredSources = combinedSources.filter((source) => {
    const matchesSearch =
      source.name.toLowerCase().includes(search.toLowerCase()) ||
      source.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || source.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'ai-tech', 'business', 'world'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 font-mono flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            CONFIGURED INGESTION SOURCES
          </h1>
          <p className="text-xs text-zinc-500 font-mono uppercase">
            Tracking {SOURCES_REGISTRY.length} verified endpoints // Reliable RSS/Atom retrieval
          </p>
        </div>
        <button
          onClick={triggerManualScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-500 hover:bg-indigo-600 text-xs font-mono text-white font-bold transition-colors shadow-lg shadow-indigo-500/20 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>SCAN SOURCES NOW</span>
        </button>
      </div>

      {/* Disclaimers & Health Summary Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="font-bold text-zinc-200">REAL NEWS SOURCE REGISTRY</span>: Feeds listed below are fetched server-side from documented public RSS/Atom feeds. Reliability metrics are set to <span className="text-indigo-400 font-bold">"Not evaluated"</span> until multi-agent cross-verification runs in Phase 3+.
        </div>
      </div>

      {/* Search and Filters controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-3">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search source endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 pl-8 font-mono text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-500">Filter Group:</span>
          <div className="flex items-center rounded border border-zinc-800 bg-zinc-950 p-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wide transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-zinc-900 text-indigo-400 font-semibold' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat === 'ai-tech' ? 'AI & TECH' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table listing sources */}
      <div className="overflow-x-auto border border-zinc-850 rounded-lg bg-zinc-950/40">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-850 bg-zinc-900/30 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
              <th className="py-3 px-4">Source Outlet</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Fetch Status</th>
              <th className="py-3 px-4">Latency (ms)</th>
              <th className="py-3 px-4">Reliability Rating</th>
              <th className="py-3 px-4 text-right">Unique Stories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/60">
            {filteredSources.map((source) => (
              <tr key={source.id} className="hover:bg-zinc-900/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-zinc-200">{source.name}</div>
                  <a 
                    href={source.homepageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] text-zinc-500 hover:text-indigo-400 transition-colors"
                  >
                    {source.homepageUrl}
                  </a>
                </td>
                <td className="py-3 px-4 text-zinc-400 uppercase text-[11px] font-semibold">
                  {source.category === 'ai-tech' ? 'AI & TECH' : source.category}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${
                      source.status === 'SUCCESS' 
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                        : source.status === 'FAILED'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        : 'text-zinc-500 bg-zinc-900 border-zinc-800'
                    }`}>
                      {source.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : source.status === 'FAILED' ? (
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-zinc-500" />
                      )}
                      {source.status}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-zinc-300">
                  {source.fetchDurationMs > 0 ? `${source.fetchDurationMs}ms` : '—'}
                </td>
                <td className="py-3 px-4 text-zinc-500 text-[11px]">
                  Not evaluated
                </td>
                <td className="py-3 px-4 text-right text-indigo-400 font-semibold">{source.storiesRetrieved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Development Debug View Section */}
      <div className="mt-8 space-y-3 rounded-lg border border-zinc-850 bg-zinc-950 p-5 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Ingestion Diagnostics (Development Debug View)
          </h2>
          <span className="text-[10px] text-zinc-500">SERVER REVALIDATE: 300s</span>
        </div>

        <div className="space-y-2 pt-2">
          {sourceStatus.length === 0 ? (
            <p className="text-zinc-500 text-[11px]">No diagnostic logs recorded yet. Trigger a scan above.</p>
          ) : (
            sourceStatus.map((st) => (
              <div key={st.sourceId} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-zinc-900/30 border border-zinc-900 text-[11px] gap-2">
                <div>
                  <span className="font-semibold text-zinc-200">{st.sourceName}</span>
                  <span className="text-zinc-500 text-[10px] ml-2">[{st.category}]</span>
                  {st.lastError && (
                    <div className="text-rose-400 text-[10px] mt-0.5">Error: {st.lastError}</div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-zinc-400 shrink-0">
                  <span>Stories: <strong className="text-zinc-200">{st.storiesRetrieved}</strong></span>
                  <span>Duration: <strong className="text-zinc-200">{st.fetchDurationMs}ms</strong></span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    st.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                  }`}>
                    {st.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
