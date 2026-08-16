'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, ActivityLog, mockAgents, mockActivityLogs } from '@/data/mockData';
import { NewsStory, SourceStatus } from '@/lib/news/types';
import { MergedIntelligenceStory, OrchestratorExecutionResult } from '@/lib/agents/types';
import { ClusteringTelemetry, EventCluster } from '@/lib/clustering/types';
import { VerificationTelemetry } from '@/lib/verification/types';
import { HealthMetrics, NotificationItem } from '@/lib/runtime/types';
import { DailyBriefing, RecommendationItem, UserProfile, WeeklyReport, Workspace, Watchlist } from '@/lib/personalization/types';
import { Organization, SharedWorkspace, Investigation, CollaborativeTask, InvestigationPriority, InvestigationStatus, TaskPriority, TaskStatus } from '@/lib/enterprise/types';
import { GraphEdge, GraphNode, KnowledgeGraph, NaturalLanguageQueryResult } from '@/lib/knowledge/types';

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

  // Phase 8 Personalization State
  userProfile: UserProfile | null;
  activeWorkspace: Workspace | null;
  dailyBriefing: DailyBriefing | null;
  weeklyReport: WeeklyReport | null;
  recommendations: RecommendationItem[];
  switchActiveWorkspace: (workspaceId: string) => Promise<void>;
  createWatchlist: (watchlistData: Partial<Watchlist>) => Promise<void>;

  // Phase 9 Enterprise State
  organization: Organization | null;
  sharedWorkspaces: SharedWorkspace[];
  investigations: Investigation[];
  tasks: CollaborativeTask[];
  createEnterpriseInvestigation: (title: string, description: string, priority: InvestigationPriority, tags: string[]) => Promise<void>;
  updateEnterpriseInvestigationStatus: (id: string, status: InvestigationStatus) => Promise<void>;
  createEnterpriseTask: (title: string, description: string, assigneeName: string, dueDate: string, priority: TaskPriority) => Promise<void>;
  updateEnterpriseTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  toggleTaskChecklist: (taskId: string, checklistItemId: string) => Promise<void>;

  // Phase 10 Knowledge Graph State
  knowledgeGraph: KnowledgeGraph | null;
  selectedEntityNode: GraphNode | null;
  selectedEntityNeighbors: { node: GraphNode; edge: GraphEdge }[];
  selectedEntityClusters: EventCluster[];
  isEntityProfileOpen: boolean;
  setIsEntityProfileOpen: (isOpen: boolean) => void;
  selectEntityNode: (node: GraphNode) => Promise<void>;
  activeQueryResult: NaturalLanguageQueryResult | null;
  executeQuery: (queryText: string) => Promise<NaturalLanguageQueryResult | null>;
  clearQuery: () => void;
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

  // Phase 8 Personalization State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefing | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  // Phase 9 Enterprise State
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [sharedWorkspaces, setSharedWorkspaces] = useState<SharedWorkspace[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [tasks, setTasks] = useState<CollaborativeTask[]>([]);

  // Phase 10 Knowledge Graph State
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph | null>(null);
  const [selectedEntityNode, setSelectedEntityNode] = useState<GraphNode | null>(null);
  const [selectedEntityNeighbors, setSelectedEntityNeighbors] = useState<{ node: GraphNode; edge: GraphEdge }[]>([]);
  const [selectedEntityClusters, setSelectedEntityClusters] = useState<EventCluster[]>([]);
  const [isEntityProfileOpen, setIsEntityProfileOpen] = useState(false);
  const [activeQueryResult, setActiveQueryResult] = useState<NaturalLanguageQueryResult | null>(null);

  // Fetch Knowledge Graph from API
  const fetchKnowledgeGraph = async () => {
    try {
      const res = await fetch('/api/graph');
      if (res.ok) {
        const data = await res.json();
        setKnowledgeGraph(data.graph || null);
      }
    } catch (err) {
      console.error('[PulseContext] Knowledge Graph fetch failed:', err);
    }
  };

  const selectEntityNode = async (node: GraphNode) => {
    setSelectedEntityNode(node);
    setIsEntityProfileOpen(true);
    try {
      const res = await fetch(`/api/entities/${node.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedEntityNeighbors(data.neighbors || []);
        setSelectedEntityClusters(data.relatedClusters || []);
      }
    } catch (err) {
      console.error('[PulseContext] Fetch entity details failed:', err);
    }
  };

  const executeQuery = async (queryText: string): Promise<NaturalLanguageQueryResult | null> => {
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      if (res.ok) {
        const data = await res.json();
        const result: NaturalLanguageQueryResult = {
          rawQuery: data.query,
          filter: data.filter,
          matchedClusterIds: (data.matchedClusters || []).map((c: EventCluster) => c.clusterId),
          explanation: data.explanation
        };
        setActiveQueryResult(result);
        return result;
      }
    } catch (err) {
      console.error('[PulseContext] Query execution failed:', err);
    }
    return null;
  };

  const clearQuery = () => {
    setActiveQueryResult(null);
  };

  // Fetch Enterprise APIs
  const fetchEnterpriseData = async () => {
    try {
      const orgRes = await fetch('/api/organizations');
      if (orgRes.ok) {
        const orgData = await orgRes.json();
        setOrganization(orgData.organization || null);
      }

      const wsRes = await fetch('/api/workspaces');
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        setSharedWorkspaces(wsData.workspaces || []);
      }

      const invRes = await fetch('/api/investigations');
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvestigations(invData.investigations || []);
      }

      const taskRes = await fetch('/api/tasks');
      if (taskRes.ok) {
        const taskData = await taskRes.json();
        setTasks(taskData.tasks || []);
      }
    } catch (err) {
      console.error('[PulseContext] Enterprise fetch failed:', err);
    }
  };

  const createEnterpriseInvestigation = async (
    title: string,
    description: string,
    priority: InvestigationPriority,
    tags: string[]
  ) => {
    try {
      const res = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, tags })
      });
      if (res.ok) {
        await fetchEnterpriseData();
      }
    } catch (err) {
      console.error('[PulseContext] Create investigation failed:', err);
    }
  };

  const updateEnterpriseInvestigationStatus = async (id: string, status: InvestigationStatus) => {
    try {
      const res = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateId: id, status })
      });
      if (res.ok) {
        await fetchEnterpriseData();
      }
    } catch (err) {
      console.error('[PulseContext] Update investigation failed:', err);
    }
  };

  const createEnterpriseTask = async (
    title: string,
    description: string,
    assigneeName: string,
    dueDate: string,
    priority: TaskPriority
  ) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, assigneeName, dueDate, priority })
      });
      if (res.ok) {
        await fetchEnterpriseData();
      }
    } catch (err) {
      console.error('[PulseContext] Create task failed:', err);
    }
  };

  const updateEnterpriseTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateTaskId: taskId, status })
      });
      if (res.ok) {
        await fetchEnterpriseData();
      }
    } catch (err) {
      console.error('[PulseContext] Update task failed:', err);
    }
  };

  const toggleTaskChecklist = async (taskId: string, checklistItemId: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleTaskId: taskId, checklistItemId })
      });
      if (res.ok) {
        await fetchEnterpriseData();
      }
    } catch (err) {
      console.error('[PulseContext] Toggle task checklist failed:', err);
    }
  };

  // Fetch Personal Feed & Profile from APIs
  const fetchPersonalization = async () => {
    try {
      const profRes = await fetch('/api/profile');
      if (profRes.ok) {
        const profData = await profRes.json();
        setUserProfile(profData.profile || null);
        setActiveWorkspace(profData.activeWorkspace || null);
      }

      const feedRes = await fetch('/api/feed');
      if (feedRes.ok) {
        const feedData = await feedRes.json();
        if (Array.isArray(feedData.feed)) {
          setEventClusters(feedData.feed);
        }
      }

      const brfRes = await fetch('/api/briefings');
      if (brfRes.ok) {
        const brfData = await brfRes.json();
        setDailyBriefing(brfData.dailyBriefing || null);
        setWeeklyReport(brfData.weeklyReport || null);
      }

      const recRes = await fetch('/api/recommendations');
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData.recommendations || []);
      }
    } catch (err) {
      console.error('[PulseContext] Personalization fetch failed:', err);
    }
  };

  const switchActiveWorkspace = async (workspaceId: string) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ switchWorkspaceId: workspaceId })
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.profile);
        setActiveWorkspace(data.activeWorkspace);
        await fetchPersonalization();
      }
    } catch (err) {
      console.error('[PulseContext] Workspace switch failed:', err);
    }
  };

  const createWatchlist = async (watchlistData: Partial<Watchlist>) => {
    try {
      const res = await fetch('/api/watchlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(watchlistData)
      });
      if (res.ok) {
        const data = await res.json();
        if (activeWorkspace) {
          setActiveWorkspace({ ...activeWorkspace, watchlists: data.watchlists });
        }
        await fetchPersonalization();
      }
    } catch (err) {
      console.error('[PulseContext] Create watchlist failed:', err);
    }
  };

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

      await fetchPersonalization();
      await fetchEnterpriseData();
      await fetchKnowledgeGraph();
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
      await fetchPersonalization();
      await fetchKnowledgeGraph();

      if (Array.isArray(data.activityLogs)) {
        setActivityLogs((prev) => [...data.activityLogs, ...prev.slice(0, 30)]);
      }

      setLastScanTime('Just now');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scout scan error';
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
        await fetchPersonalization();
        await fetchEnterpriseData();
        await fetchKnowledgeGraph();

        const eventsRes = await fetch('/api/events');
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (isMounted) {
            setClusterTelemetry(eventsData.telemetry || null);
            setVerificationTelemetry(eventsData.verificationTelemetry || null);
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
        markAllNotificationsAsRead,
        userProfile,
        activeWorkspace,
        dailyBriefing,
        weeklyReport,
        recommendations,
        switchActiveWorkspace,
        createWatchlist,
        organization,
        sharedWorkspaces,
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
