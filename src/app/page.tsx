'use client';

import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Flame, Cpu, 
  ArrowUpDown, Sparkles, Database 
} from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import MetricCard from '@/components/MetricCard';
import BreakingStory from '@/components/BreakingStory';
import StoryCard from '@/components/StoryCard';
import ActivityFeed from '@/components/ActivityFeed';
import SourceStatusAlert from '@/components/SourceStatusAlert';
import { NewsStory } from '@/lib/news/types';

export default function OverviewPage() {
  const { 
    stories, 
    sourceStatus,
    agents, 
    activityLogs, 
    savedStories, 
    toggleSave, 
    setSelectedStory, 
    setIsDetailOpen, 
    searchQuery,
    isScanning,
    isLoading,
    triggerManualScan
  } = usePulse();

  const [sortKey, setSortKey] = useState<'time' | 'sources'>('time');

  // Truth-based statistics derived from real ingestion
  const totalRetrieved = stories.length;
  const successfulSources = sourceStatus.filter(s => s.status === 'SUCCESS').length;
  const totalSourcesCount = sourceStatus.length || 6;
  const activeAgentsCount = agents.filter(a => a.status !== 'IDLE').length;

  // Filter and sort stories
  const filteredStories = stories
    .filter(story => {
      const matchesSearch = searchQuery === '' || 
        story.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortKey === 'sources') {
        return (b.corroboratingSources?.length || 1) - (a.corroboratingSources?.length || 1);
      }
      // Default: sort by date descending
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const handleSelectStory = (story: NewsStory) => {
    setSelectedStory(story);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Page Title & Real Feed Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 font-mono">INTELLIGENCE OVERVIEW</h1>
          <p className="text-xs text-zinc-500 font-mono">REAL NEWS INGESTION LAYER // SERVER-SIDE FETCH & DEDUPLICATION</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold">
          <Database className="w-3.5 h-3.5" />
          <span>VERIFIED REAL FEEDS ACTIVE</span>
        </div>
      </div>

      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Stories Retrived" 
          value={totalRetrieved} 
          subtext="Deduplicated real stories" 
          icon={FileText} 
        />
        <MetricCard 
          title="Active Feed Sources" 
          value={`${successfulSources}/${totalSourcesCount}`} 
          subtext="Healthy RSS endpoints" 
          icon={ShieldCheck} 
          trendType="positive"
        />
        <MetricCard 
          title="Ingestion Engine" 
          value="Phase 2" 
          subtext="Server-side cached" 
          icon={Flame} 
          trendType="neutral"
        />
        <MetricCard 
          title="Active System Agents" 
          value={`${activeAgentsCount}/${agents.length}`} 
          subtext="Agents running operations" 
          icon={Cpu} 
          trendType="live"
        />
      </div>

      {/* 2. Main Split Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Feed (Takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Source Fault-Tolerance Warning Banner */}
          <SourceStatusAlert statuses={sourceStatus} onRefresh={triggerManualScan} />

          {/* Feed Header and Controls */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 pb-3 gap-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Real News Feed ({filteredStories.length})
            </h2>

            {/* Sorting Control */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select 
                value={sortKey} 
                onChange={(e) => setSortKey(e.target.value as 'time' | 'sources')}
                className="bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-zinc-700"
              >
                <option value="time">Time: Newest First</option>
                <option value="sources">Corroboration: Multi-Source</option>
              </select>
            </div>
          </div>

          {/* Feed List */}
          {isLoading || isScanning ? (
            // Skeleton loading state
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border border-zinc-900 rounded-lg p-5 bg-zinc-900/10 space-y-3 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-3.5 bg-zinc-800 rounded"></div>
                    <div className="w-20 h-3 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="w-3/4 h-4 bg-zinc-800 rounded"></div>
                  <div className="w-full h-3 bg-zinc-800 rounded"></div>
                  <div className="w-5/6 h-3 bg-zinc-800 rounded"></div>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-900/60">
                    <div className="w-24 h-4 bg-zinc-800 rounded"></div>
                    <div className="w-16 h-3.5 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStories.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg py-16 px-4 bg-zinc-900/5 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 mb-3">
                <Sparkles className="w-5 h-5 opacity-60" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-300 font-mono">No Ingested Stories Found</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Try clearing your search term or triggering a manual scan refresh.
              </p>
            </div>
          ) : (
            // Real News feed list
            <div className="space-y-4">
              {filteredStories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onSelect={handleSelectStory}
                  isSaved={savedStories.includes(story.id)}
                  onToggleSave={(e, storyId) => {
                    e.stopPropagation();
                    toggleSave(storyId);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active operations feed */}
        <div className="space-y-4">
          <ActivityFeed logs={activityLogs} />
          
          {/* Source Status Quick Table */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-850 pb-2 mb-3">
              Source Feeds Health
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {sourceStatus.map((src) => (
                <div key={src.sourceId} className="flex items-center justify-between">
                  <span className="text-zinc-300 truncate">{src.sourceName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-[10px]">{src.storiesRetrieved} stories</span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                      src.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {src.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
