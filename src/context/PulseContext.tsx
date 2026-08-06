'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, ActivityLog, mockAgents, mockActivityLogs } from '@/data/mockData';
import { NewsStory, SourceStatus } from '@/lib/news/types';
import { MergedIntelligenceStory, OrchestratorExecutionResult } from '@/lib/agents/types';
import { ClusteringTelemetry, EventCluster } from '@/lib/clustering/types';
import { VerificationTelemetry } from '@/lib/verification/types';
import { HealthMetrics, NotificationItem } from '@/lib/runtime/types';

interface PulseContextType {
  stories: NewsStory[];
  sourceStatus: SourceStatus[];
  agents: Agent[];
  activityLogs: ActivityLog[];
  savedStories: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleSave: (storyId: string) => void;
  selectedStory: NewsStory | null;
  setSelectedStory: (story: NewsStory | null) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (isOpen: boolean) => void;
  toggleAgentStatus: (agentId: string) => void;
  lastScanTime: string;
  triggerManualScan: () => void;
  triggerScoutScan: () => Promise<void>;
  isScanning: boolean;
  isLoading: boolean;
  executionResult: OrchestratorExecutionResult | null;
  scoutIntelligence: MergedIntelligenceStory[];
  
  // Phase 4, 5, 6 Event Clusters & Verification State
  eventClusters: EventCluster[];
  clusterTelemetry: ClusteringTelemetry | null;
  verificationTelemetry: VerificationTelemetry | null;
  selectedCluster: EventCluster | null;
  setSelectedCluster: (cluster: EventCluster | null) => void;
  isClusterDetailOpen: boolean;
  setIsClusterDetailOpen: (isOpen: boolean) => void;
  verificationStatusFilter: string;
  setVerificationStatusFilter: (status: string) => void;

  // Phase 7 Autonomous Runtime State
  healthMetrics: HealthMetrics | null;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  isRunningPipeline: boolean;
  triggerAutonomousPipelineRun: () => Promise<void>;
  markAllNotificationsAsRead: () => void;
}

const PulseContext = createContext<PulseContextType | undefined>(undefined);

export function PulseProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [sourceStatus, setSourceStatus] = useState<SourceStatus[]>([]);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<NewsStory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [lastScanTime, setLastScanTime] = useState('Just now');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Phase 3, 4, 5, 6 State
  const [executionResult, setExecutionResult] = useState<OrchestratorExecutionResult | null>(null);
  const [scoutIntelligence, setScoutIntelligence] = useState<MergedIntelligenceStory[]>([]);
  const [eventClusters, setEventClusters] = useState<EventCluster[]>([]);
  const [clusterTelemetry, setClusterTelemetry] = useState<ClusteringTelemetry | null>(null);
  const [verificationTelemetry, setVerificationTelemetry] = useState<VerificationTelemetry | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<EventCluster | null>(null);
  const [isClusterDetailOpen, setIsClusterDetailOpen] = useState(false);
  const [verificationStatusFilter, setVerificationStatusFilter] = useState<string>('ALL');

  // Phase 7 Runtime State
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  // Fetch real stories from GET /api/news
  const fetchNews = async (forceRefresh = false) => {
    setIsScanning(true);
    try {
      const url = forceRefresh ? '/api/news?refresh=true' : '/api/news';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API HTTP Error ${res.status}`);

      const data = await res.json();
      setStories(data.stories || []);
      setSourceStatus(data.sourceStatus || []);
      setLastScanTime('Just now');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[PulseContext] Failed to fetch real news:', msg);
    } finally {
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  // Fetch Event Clusters from GET /api/events
  const fetchEventClusters = async (forceRefresh = false) => {
    try {
      const url = forceRefresh ? '/api/events?refresh=true' : '/api/events';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEventClusters(data.clusters || []);
        setClusterTelemetry(data.telemetry || null);
        setVerificationTelemetry(data.verificationTelemetry || null);
      }
    } catch (err: unknown) {
      console.error('[PulseContext] Failed to fetch event clusters:', err);
    }
  };

  // Trigger Phase 7 Autonomous Pipeline Run via POST /api/runtime/run
  const triggerAutonomousPipelineRun = async () => {
    if (isRunningPipeline) return;
    setIsRunningPipeline(true);

    try {
      const res = await fetch('/api/runtime/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: true })
      });

      if (!res.ok) throw new Error(`Runtime Run HTTP Error ${res.status}`);

      const data = await res.json();
      if (Array.isArray(data.notifications)) {
        setNotifications((prev) => [...data.notifications, ...prev]);
      }

      // Refresh event clusters and health
      await fetchEventClusters();
      await fetchRuntimeHealth();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pipeline run error';
      console.error('[PulseContext] Autonomous pipeline run failed:', msg);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  // Fetch runtime health from GET /api/runtime/health
  const fetchRuntimeHealth = async () => {
    try {
      const res = await fetch('/api/runtime/health');
      if (res.ok) {
        const data = await res.json();
        setHealthMetrics(data.health || null);
      }
    } catch (err: unknown) {
      console.error('[PulseContext] Failed to fetch health metrics:', err);
    }
  };

  // Trigger full multi-agent scout execution POST /api/agents/scout
  const triggerScoutScan = async () => {
    if (isScanning) return;
    setIsScanning(true);

    try {
      const res = await fetch('/api/agents/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: true, minScore: 40 })
      });

      if (!res.ok) throw new Error(`Scout API HTTP Error ${res.status}`);

      const data = await res.json();
      setExecutionResult({
        executionId: data.executionId,
        startedAt: data.startedAt,
        completedAt: data.completedAt,
        durationMs: data.durationMs,
        status: data.status,
        totalStoriesProcessed: data.totalStoriesProcessed,
        totalSelected: data.totalSelected,
        agentTelemetry: data.agentTelemetry || [],
        intelligence: data.intelligence || [],
        eventClusters: data.eventClusters || []
      });

      setScoutIntelligence(data.intelligence || []);
      if (Array.isArray(data.eventClusters)) {
        setEventClusters(data.eventClusters);
      }
      if (data.clusterTelemetry) {
        setClusterTelemetry(data.clusterTelemetry);
      }
      if (data.verificationTelemetry) {
        setVerificationTelemetry(data.verificationTelemetry);
      }

      if (Array.isArray(data.activityLogs)) {
        setActivityLogs((prev) => [...data.activityLogs, ...prev.slice(0, 30)]);
      }

      setLastScanTime('Just now');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scout run error';
      console.error('[PulseContext] Scout scan failed:', msg);
    } finally {
      setIsScanning(false);
    }
  };

  // Fetch initial news, clusters, and run initial scout execution on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      try {
        await fetchRuntimeHealth();

        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setEventClusters(data.clusters || []);
            setClusterTelemetry(data.telemetry || null);
            setVerificationTelemetry(data.verificationTelemetry || null);
          }
        }

        const newsRes = await fetch('/api/news');
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (isMounted) {
            setStories(newsData.stories || []);
            setSourceStatus(newsData.sourceStatus || []);
          }
        }
      } catch (err: unknown) {
        console.error('[PulseContext] Mount fetch failed:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSave = (storyId: string) => {
    setSavedStories((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleAgentStatus = (agentId: string) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => {
        if (agent.id === agentId) {
          const isCurrentlyIdle = agent.status === 'IDLE';
          const newStatus = isCurrentlyIdle ? 'RUNNING' : 'IDLE';

          const newLog: ActivityLog = {
            id: `log-${Date.now()}`,
            timestamp: 'Just now',
            agentId: agent.id,
            agentName: agent.name,
            message: `Operator manual override: Set agent to ${newStatus}.`,
            type: isCurrentlyIdle ? 'info' : 'warning'
          };
          setActivityLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 49)]);

          return {
            ...agent,
            status: newStatus,
            lastExecution: 'Just now'
          };
        }
        return agent;
      })
    );
  };

  const triggerManualScan = () => {
    fetchNews(true);
    fetchEventClusters(true);
    triggerScoutScan();
    triggerAutonomousPipelineRun();
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <PulseContext.Provider
      value={{
        stories,
        sourceStatus,
        agents,
        activityLogs,
        savedStories,
        searchQuery,
        setSearchQuery,
        toggleSave,
        selectedStory,
        setSelectedStory,
        isDetailOpen,
        setIsDetailOpen,
        toggleAgentStatus,
        lastScanTime,
        triggerManualScan,
        triggerScoutScan,
        isScanning,
        isLoading,
        executionResult,
        scoutIntelligence,
        eventClusters,
        clusterTelemetry,
        verificationTelemetry,
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
      }}
    >
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (context === undefined) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
}
