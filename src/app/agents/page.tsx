'use client';

import React, { useState } from 'react';
import { Cpu, Play, ArrowUpDown, Filter, Sparkles, Database, Activity, RefreshCw } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import AgentCard from '@/components/AgentCard';
import ActivityFeed from '@/components/ActivityFeed';
import OrchestratorVisualizer from '@/components/OrchestratorVisualizer';
import ScoutIntelligenceCard from '@/components/ScoutIntelligenceCard';
import ScoreBreakdownModal from '@/components/ScoreBreakdownModal';
import { MergedIntelligenceStory } from '@/lib/agents/types';
import { REGISTERED_SCOUTS } from '@/lib/agents/orchestrator';

export default function AgentsPage() {
  const { 
    executionResult, 
    scoutIntelligence, 
    activityLogs, 
    isScanning, 
    triggerScoutScan,
    setSelectedStory,
    setIsDetailOpen,
    searchQuery
  } = usePulse();

  const [scoutFilter, setScoutFilter] = useState<'ALL' | 'ai-tech' | 'business' | 'world'>('ALL');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(40);
  const [selectedBreakdownItem, setSelectedBreakdownItem] = useState<MergedIntelligenceStory | null>(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  // Filter intelligence results
  const filteredIntelligence = scoutIntelligence.filter((item) => {
    // 1. Filter by Scout/Category
    const matchesScout = scoutFilter === 'ALL' || item.story.category === scoutFilter || item.primaryScoutId.includes(scoutFilter);
    
    // 2. Filter by Minimum Score
    const matchesScore = item.topScore >= minScoreFilter;

    // 3. Filter by global search query
    const matchesSearch = searchQuery === '' ||
      item.story.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.story.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.matchedSignals.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesScout && matchesScore && matchesSearch;
  });

  const handleOpenBreakdown = (item: MergedIntelligenceStory) => {
    setSelectedBreakdownItem(item);
    setIsBreakdownOpen(true);
  };

  const handleSelectStory = (story: any) => {
    setSelectedStory(story);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-indigo-400 font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 animate-pulse" />
            AGENT OPERATIONS COMMAND CENTER
          </h1>
          <p className="text-xs text-zinc-500 font-mono">MULTI-AGENT SCOUT PIPELINE // DETERMINISTIC SIGNAL & SELECTION SCORING ENGINE</p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={triggerScoutScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 font-mono text-xs text-white font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'EXECUTING SCOUT SCAN...' : 'RUN INTELLIGENCE SCAN'}</span>
        </button>
      </div>

      {/* 1. Visual Orchestrator Pipeline */}
      <OrchestratorVisualizer execution={executionResult} isScanning={isScanning} />

      {/* 2. Fleet of Real Agent Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Runtime Scout Telemetry
          </h2>
          <span className="text-[10px] font-mono text-zinc-500">REAL EXECUTION METRICS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REGISTERED_SCOUTS.map((scout) => {
            const telemetry = executionResult?.agentTelemetry.find((t) => t.agentId === scout.id);
            return (
              <AgentCard
                key={scout.id}
                name={scout.name}
                role={scout.description}
                category={scout.category}
                telemetry={telemetry}
                isScanning={isScanning}
                onRunScout={triggerScoutScan}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Main Split Section: Scout Intelligence Feed & Live Activity Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Left Column: Scout Intelligence Feed (2/3 space) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Feed Header and Controls */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 pb-3 gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                Scout Intelligence Candidate Feed ({filteredIntelligence.length})
              </h2>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap text-[11px] font-mono">
              {/* Domain Category Filter */}
              <div className="flex items-center rounded border border-zinc-800 bg-zinc-950 p-0.5">
                {(['ALL', 'ai-tech', 'business', 'world'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setScoutFilter(cat)}
                    className={`px-2 py-0.5 rounded-sm uppercase transition-colors text-[10px] font-bold ${
                      scoutFilter === cat 
                        ? 'bg-zinc-900 text-indigo-400 font-semibold' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {cat === 'ai-tech' ? 'AI & TECH' : cat}
                  </button>
                ))}
              </div>

              {/* Minimum Score Threshold Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500">Min Score:</span>
                <select
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(parseInt(e.target.value, 10))}
                  className="bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-zinc-700"
                >
                  <option value={30}>30+ (All Candidates)</option>
                  <option value={50}>50+ (Medium Signal)</option>
                  <option value={70}>70+ (High Signal)</option>
                  <option value={85}>85+ (Critical Signal)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Intelligence List */}
          {isScanning ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border border-zinc-900 rounded-lg p-5 bg-zinc-900/10 space-y-3 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-zinc-800 rounded"></div>
                    <div className="w-20 h-4 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="w-3/4 h-4 bg-zinc-800 rounded"></div>
                  <div className="w-full h-3 bg-zinc-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredIntelligence.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg py-16 px-4 bg-zinc-900/5 text-center">
              <Sparkles className="w-6 h-6 text-zinc-600 mb-2 opacity-50" />
              <h3 className="text-sm font-semibold text-zinc-400 font-mono">No Candidates Met Threshold</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Try lowering the minimum score threshold or executing a new scan across fresh Phase 2 feeds.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIntelligence.map((item) => (
                <ScoutIntelligenceCard
                  key={item.id}
                  item={item}
                  onViewBreakdown={handleOpenBreakdown}
                  onSelectStory={handleSelectStory}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Real Activity Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Runtime Telemetry Log
            </h2>
          </div>

          <ActivityFeed logs={activityLogs} />
        </div>

      </div>

      {/* Score Breakdown Modal */}
      <ScoreBreakdownModal
        item={selectedBreakdownItem}
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
      />

    </div>
  );
}
