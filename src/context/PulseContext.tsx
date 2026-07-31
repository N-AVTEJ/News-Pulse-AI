'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, ActivityLog, mockAgents, mockActivityLogs } from '@/data/mockData';
import { NewsStory, SourceStatus } from '@/lib/news/types';
import { MergedIntelligenceStory, OrchestratorExecutionResult } from '@/lib/agents/types';
import { ClusteringTelemetry, EventCluster } from '@/lib/clustering/types';

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
  
  // Phase 4 Event Clustering State
  eventClusters: EventCluster[];
  clusterTelemetry: ClusteringTelemetry | null;
  selectedCluster: EventCluster | null;
  setSelectedCluster: (cluster: EventCluster | null) => void;
  isClusterDetailOpen: boolean;
  setIsClusterDetailOpen: (isOpen: boolean) => void;
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

  // Phase 3 & 4 State
  const [executionResult, setExecutionResult] = useState<OrchestratorExecutionResult | null>(null);
  const [scoutIntelligence, setScoutIntelligence] = useState<MergedIntelligenceStory[]>([]);
  const [eventClusters, setEventClusters] = useState<EventCluster[]>([]);
  const [clusterTelemetry, setClusterTelemetry] = useState<ClusteringTelemetry | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<EventCluster | null>(null);
  const [isClusterDetailOpen, setIsClusterDetailOpen] = useState(false);

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
      }
    } catch (err: unknown) {
      console.error('[PulseContext] Failed to fetch event clusters:', err);
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

      if (Array.isArray(data.activityLogs)) {
        setActivityLogs((prev) => [...data.activityLogs, ...prev.slice(0, 30)]);
      }

      setLastScanTime('Just now');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scout run error';
      console.error('[PulseContext] Scout scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Fetch initial news, clusters, and run initial scout execution on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setEventClusters(data.clusters || []);
            setClusterTelemetry(data.telemetry || null);
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

        // Initial Scout run
        const scoutRes = await fetch('/api/agents/scout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minScore: 40 })
        });

        if (scoutRes.ok && isMounted) {
          const scoutData = await scoutRes.json();
          setExecutionResult({
            executionId: scoutData.executionId,
            startedAt: scoutData.startedAt,
            completedAt: scoutData.completedAt,
            durationMs: scoutData.durationMs,
            status: scoutData.status,
            totalStoriesProcessed: scoutData.totalStoriesProcessed,
            totalSelected: scoutData.totalSelected,
            agentTelemetry: scoutData.agentTelemetry || [],
            intelligence: scoutData.intelligence || [],
            eventClusters: scoutData.eventClusters || []
          });
          setScoutIntelligence(scoutData.intelligence || []);
          if (Array.isArray(scoutData.eventClusters)) {
            setEventClusters(scoutData.eventClusters);
          }
          if (scoutData.clusterTelemetry) {
            setClusterTelemetry(scoutData.clusterTelemetry);
          }
          if (Array.isArray(scoutData.activityLogs)) {
            setActivityLogs((prev) => [...scoutData.activityLogs, ...prev.slice(0, 30)]);
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
  };

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
        selectedCluster,
        setSelectedCluster,
        isClusterDetailOpen,
        setIsClusterDetailOpen
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
