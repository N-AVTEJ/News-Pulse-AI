'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, ActivityLog, mockAgents, mockActivityLogs } from '@/data/mockData';
import { NewsStory, SourceStatus } from '@/lib/news/types';

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
  isScanning: boolean;
  isLoading: boolean;
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

      // Update agent stats truthfully
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          if (agent.status !== 'IDLE') {
            return {
              ...agent,
              storiesProcessed: agent.storiesProcessed + (data.stories?.length || 0),
              lastExecution: 'Just now'
            };
          }
          return agent;
        })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[PulseContext] Failed to fetch real news:', err);
      setActivityLogs((prev) => [
        {
          id: `log-err-${Date.now()}`,
          timestamp: 'Just now',
          agentId: 'system',
          agentName: 'System Ingestion',
          message: `Ingestion fetch error: ${msg}`,
          type: 'error'
        },
        ...prev
      ]);
    } finally {
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error(`API HTTP Error ${res.status}`);
        const data = await res.json();

        if (isMounted) {
          setStories(data.stories || []);
          setSourceStatus(data.sourceStatus || []);
          setLastScanTime('Just now');
        }
      } catch (err: unknown) {
        console.error('[PulseContext] Mount fetch failed:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialNews();

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
    if (isScanning) return;
    const startLog: ActivityLog = {
      id: `log-scan-${Date.now()}`,
      timestamp: 'Just now',
      agentId: 'system',
      agentName: 'System Core',
      message: 'Global real news ingestion manual scan triggered.',
      type: 'info'
    };
    setActivityLogs((prev) => [startLog, ...prev]);

    fetchNews(true);
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
        isScanning,
        isLoading
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
