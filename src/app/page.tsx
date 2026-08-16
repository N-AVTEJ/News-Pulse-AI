'use client';

import React, { useState } from 'react';
import { Activity, Sparkles, Network } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import EventClusterCard from '@/components/EventClusterCard';
import EventClusterVisualizer from '@/components/EventClusterVisualizer';
import VerificationMetricCards from '@/components/VerificationMetricCards';
import EventDetailModal from '@/components/EventDetailModal';
import PipelineStatusBanner from '@/components/PipelineStatusBanner';
import NotificationsDrawer from '@/components/NotificationsDrawer';
import HealthMonitorPanel from '@/components/HealthMonitorPanel';
import WorkspaceSwitcher from '@/components/WorkspaceSwitcher';
import PersonalDashboardWidgets from '@/components/PersonalDashboardWidgets';
import WatchlistManager from '@/components/WatchlistManager';
import BriefingModal from '@/components/BriefingModal';
import TeamDashboardPanel from '@/components/TeamDashboardPanel';
import InvestigationManager from '@/components/InvestigationManager';
import TaskManager from '@/components/TaskManager';
import AuditLogModal from '@/components/AuditLogModal';
import ExecutiveCommandCenter from '@/components/ExecutiveCommandCenter';
import NaturalLanguageQueryBar from '@/components/NaturalLanguageQueryBar';
import GraphExplorer from '@/components/GraphExplorer';
import EntityProfileModal from '@/components/EntityProfileModal';
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
    markAllNotificationsAsRead,
    userProfile,
    activeWorkspace,
    dailyBriefing,
    weeklyReport,
    recommendations,
    switchActiveWorkspace,
    createWatchlist,
    organization,
    investigations,
    tasks,
    createEnterpriseInvestigation,
    updateEnterpriseInvestigationStatus,
    createEnterpriseTask,
    updateEnterpriseTaskStatus,
    toggleTaskChecklist,
    knowledgeGraph,
    selectedEntityNode,
    selectedEntityNeighbors,
    selectedEntityClusters,
    isEntityProfileOpen,
    setIsEntityProfileOpen,
    selectEntityNode,
    activeQueryResult,
    executeQuery,
    clearQuery
  } = usePulse();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isWatchlistsOpen, setIsWatchlistsOpen] = useState(false);
  const [isInvestigationsOpen, setIsInvestigationsOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const filteredClusters = eventClusters.filter((cluster) => {
    // 1. Natural language query result match
    if (activeQueryResult && activeQueryResult.matchedClusterIds) {
      if (!activeQueryResult.matchedClusterIds.includes(cluster.clusterId)) return false;
    }

    // 2. Verification status filter
    const matchesStatus = verificationStatusFilter === 'ALL' || cluster.verificationResult?.verificationStatus === verificationStatusFilter;

    // 3. Global search query across headline, summary, publishers, and extracted entities
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

      {/* Overview Header with Workspace Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-4 gap-4 font-mono">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            INTELLIGENCE OPERATING SYSTEM — EXECUTIVE COMMAND CENTER
          </h1>
          <p className="text-xs text-zinc-500">
            OPERATOR: {userProfile?.name.toUpperCase() || 'ANALYST'} {'//'} ORG: {organization?.name.toUpperCase() || 'NEWSPULSE GLOBAL'} {'//'} WORKSPACE: {activeWorkspace?.name.toUpperCase() || 'PERSONAL'}
          </p>
        </div>

        {userProfile && activeWorkspace && (
          <WorkspaceSwitcher
            workspaces={userProfile.workspaces}
            activeWorkspace={activeWorkspace}
            onSwitchWorkspace={switchActiveWorkspace}
          />
        )}
      </div>

      {/* Phase 10 Executive Command Center */}
      <ExecutiveCommandCenter
        eventClusters={eventClusters}
        graph={knowledgeGraph}
        onSelectCluster={handleSelectCluster}
      />

      {/* Phase 10 Natural Language Query Bar */}
      <NaturalLanguageQueryBar
        onExecuteQuery={executeQuery}
        onClearQuery={clearQuery}
        activeQueryResult={activeQueryResult}
      />

      {/* Phase 10 Enterprise Knowledge Graph Explorer */}
      <GraphExplorer
        graph={knowledgeGraph}
        onSelectNode={selectEntityNode}
      />

      {/* Phase 9 Team Dashboard Panel */}
      <TeamDashboardPanel
        organization={organization}
        investigations={investigations}
        tasks={tasks}
        onOpenInvestigations={() => setIsInvestigationsOpen(true)}
        onOpenTasks={() => setIsTasksOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* Phase 8 Personal Dashboard Widgets */}
      {activeWorkspace && (
        <PersonalDashboardWidgets
          dailyBriefing={dailyBriefing}
          watchlists={activeWorkspace.watchlists || []}
          recommendations={recommendations}
          onOpenBriefing={() => setIsBriefingOpen(true)}
          onOpenWatchlists={() => setIsWatchlistsOpen(true)}
          onSelectRecommendation={(rec) => {
            if (rec.clusterId) handleSelectClusterById(rec.clusterId);
          }}
        />
      )}

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
        
        {/* Left 2 Columns: Personal Intelligence Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 font-mono flex-wrap gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" />
              Verified Event Intelligence Feed ({filteredClusters.length})
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
              <h3 className="text-sm font-semibold text-zinc-400">No Event Clusters Match Query Criteria</h3>
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

      {/* Entity Profile Modal */}
      <EntityProfileModal
        isOpen={isEntityProfileOpen}
        onClose={() => setIsEntityProfileOpen(false)}
        node={selectedEntityNode}
        neighbors={selectedEntityNeighbors}
        relatedClusters={selectedEntityClusters}
        onSelectCluster={(cluster) => {
          setIsEntityProfileOpen(false);
          handleSelectCluster(cluster);
        }}
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

      {/* Executive Briefing Modal */}
      <BriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        dailyBriefing={dailyBriefing}
        weeklyReport={weeklyReport}
      />

      {/* Custom Watchlists Manager Modal */}
      {activeWorkspace && (
        <WatchlistManager
          isOpen={isWatchlistsOpen}
          onClose={() => setIsWatchlistsOpen(false)}
          watchlists={activeWorkspace.watchlists || []}
          onCreateWatchlist={createWatchlist}
        />
      )}

      {/* Enterprise Investigations Manager Modal */}
      <InvestigationManager
        isOpen={isInvestigationsOpen}
        onClose={() => setIsInvestigationsOpen(false)}
        investigations={investigations}
        onCreateInvestigation={createEnterpriseInvestigation}
        onUpdateStatus={updateEnterpriseInvestigationStatus}
      />

      {/* Collaborative Tasks Board Modal */}
      <TaskManager
        isOpen={isTasksOpen}
        onClose={() => setIsTasksOpen(false)}
        tasks={tasks}
        onCreateTask={createEnterpriseTask}
        onUpdateStatus={updateEnterpriseTaskStatus}
        onToggleChecklist={toggleTaskChecklist}
      />

      {/* Immutable Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />

    </div>
  );
}
