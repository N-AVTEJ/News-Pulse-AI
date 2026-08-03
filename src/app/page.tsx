'use client';

import React from 'react';
import { Activity, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import EventClusterCard from '@/components/EventClusterCard';
import EventClusterVisualizer from '@/components/EventClusterVisualizer';
import VerificationMetricCards from '@/components/VerificationMetricCards';
import EventDetailModal from '@/components/EventDetailModal';
import ActivityFeed from '@/components/ActivityFeed';
import SourceStatusAlert from '@/components/SourceStatusAlert';
import { EventCluster } from '@/lib/clustering/types';

export default function OverviewPage() {
  const { 
    eventClusters, 
    clusterTelemetry, 
    verificationTelemetry,
    sourceStatus, 
    activityLogs, 
    searchQuery, 
    isScanning, 
    triggerManualScan,
    selectedCluster,
    setSelectedCluster,
    isClusterDetailOpen,
    setIsClusterDetailOpen,
    verificationStatusFilter,
    setVerificationStatusFilter
  } = usePulse();

  const filteredClusters = eventClusters.filter((cluster) => {
    // 1. Verification status filter
    const matchesStatus = verificationStatusFilter === 'ALL' || cluster.verificationResult?.verificationStatus === verificationStatusFilter;

    // 2. Global search query
    const matchesSearch = searchQuery === '' ||
      cluster.canonicalHeadline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.publishers.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleSelectCluster = (cluster: EventCluster) => {
    setSelectedCluster(cluster);
    setIsClusterDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Source Status Warning Banner */}
      <SourceStatusAlert statuses={sourceStatus} />

      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-4 gap-4 font-mono">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            VERIFIED EVENT INTELLIGENCE COMMAND CENTER
          </h1>
          <p className="text-xs text-zinc-500">
            DETERMINISTIC VERIFICATION ENGINE // EVIDENCE GRAPH RELATIONAL TOPOLOGY
          </p>
        </div>

        <button
          onClick={triggerManualScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'VERIFYING & CLUSTERING...' : 'SCAN & RE-VERIFY'}</span>
        </button>
      </div>

      {/* Phase 5 Verification Metrics */}
      <VerificationMetricCards
        telemetry={verificationTelemetry}
        activeStatusFilter={verificationStatusFilter}
        onSelectStatusFilter={setVerificationStatusFilter}
      />

      {/* Clustering Telemetry Visualizer */}
      <EventClusterVisualizer telemetry={clusterTelemetry} />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Event Clusters Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 font-mono flex-wrap gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" />
              Verified Event Clusters ({filteredClusters.length})
            </h2>
            
            {verificationStatusFilter !== 'ALL' && (
              <button
                onClick={() => setVerificationStatusFilter('ALL')}
                className="text-[10px] text-indigo-400 hover:underline font-bold"
              >
                Clear Filter ({verificationStatusFilter})
              </button>
            )}
          </div>

          {isScanning ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border border-zinc-900 rounded-lg p-5 bg-zinc-900/10 space-y-3 animate-pulse">
                  <div className="w-1/3 h-4 bg-zinc-800 rounded"></div>
                  <div className="w-3/4 h-5 bg-zinc-800 rounded"></div>
                  <div className="w-full h-4 bg-zinc-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredClusters.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg py-16 px-4 bg-zinc-900/5 text-center font-mono">
              <Sparkles className="w-6 h-6 text-zinc-600 mb-2 opacity-50" />
              <h3 className="text-sm font-semibold text-zinc-400">No Verified Event Clusters Match Filter</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Try selecting a different verification status filter or execute a fresh scan across real Phase 2 feeds.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClusters.map((cluster) => (
                <EventClusterCard
                  key={cluster.clusterId}
                  cluster={cluster}
                  onSelectCluster={handleSelectCluster}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Live Activity Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 font-mono">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Activity Telemetry Log
            </h2>
          </div>

          <ActivityFeed logs={activityLogs} />
        </div>

      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        cluster={selectedCluster}
        isOpen={isClusterDetailOpen}
        onClose={() => setIsClusterDetailOpen(false)}
      />

    </div>
  );
}
