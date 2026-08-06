'use client';

import React, { useState } from 'react';
import { Activity, Sparkles, ShieldCheck } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import EventClusterCard from '@/components/EventClusterCard';
import EventClusterVisualizer from '@/components/EventClusterVisualizer';
import VerificationMetricCards from '@/components/VerificationMetricCards';
import EventDetailModal from '@/components/EventDetailModal';
import PipelineStatusBanner from '@/components/PipelineStatusBanner';
import NotificationsDrawer from '@/components/NotificationsDrawer';
import HealthMonitorPanel from '@/components/HealthMonitorPanel';
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
    selectedCluster,
    setSelectedCluster,
    isClusterDetailOpen,
    setIsClusterDetailOpen,
    verificationStatusFilter,
    setVerificationStatusFilter,
    healthMetrics,
    notifications,
    unreadNotificationsCount,
    isRunningPipeline,
    triggerAutonomousPipelineRun,
    markAllNotificationsAsRead
  } = usePulse();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);

  const filteredClusters = eventClusters.filter((cluster) => {
    // 1. Verification status filter
    const matchesStatus = verificationStatusFilter === 'ALL' || cluster.verificationResult?.verificationStatus === verificationStatusFilter;

    // 2. Global search query across headline, summary, publishers, and extracted entities
    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      cluster.canonicalHeadline.toLowerCase().includes(q) ||
      cluster.summary.toLowerCase().includes(q) ||
      cluster.publishers.some(p => p.toLowerCase().includes(q)) ||
      (cluster.analysisReport?.entities || []).some(e => e.name.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleSelectCluster = (cluster: EventCluster) => {
    setSelectedCluster(cluster);
    setIsClusterDetailOpen(true);
  };

  const handleSelectClusterById = (clusterId: string) => {
    const found = eventClusters.find(c => c.clusterId === clusterId);
    if (found) {
      setSelectedCluster(found);
      setIsClusterDetailOpen(true);
      setIsNotificationsOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Source Status Warning Banner */}
      <SourceStatusAlert statuses={sourceStatus} />

      {/* Phase 7 Autonomous Pipeline Status Banner */}
      <PipelineStatusBanner
        health={healthMetrics}
        isRunningPipeline={isRunningPipeline || isScanning}
        onTriggerRun={triggerAutonomousPipelineRun}
        onOpenHealth={() => setIsHealthOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-4 gap-4 font-mono">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            AUTONOMOUS INTELLIGENCE COMMAND CENTER
          </h1>
          <p className="text-xs text-zinc-500">
            CONTINUOUS INGESTION // INCREMENTAL CHANGE DETECTION // EVIDENCE-GROUNDED AI
          </p>
        </div>
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

          {isRunningPipeline || isScanning ? (
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
              <h3 className="text-sm font-semibold text-zinc-400">No Event Clusters Match Search Criteria</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Try clearing search filters or trigger an autonomous pipeline run.
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

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllNotificationsAsRead}
        onSelectCluster={handleSelectClusterById}
      />

      {/* Health Monitor & History Panel */}
      <HealthMonitorPanel
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
        health={healthMetrics}
      />

    </div>
  );
}
