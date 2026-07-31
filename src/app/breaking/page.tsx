'use client';

import React from 'react';
import { Radio } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import EventClusterCard from '@/components/EventClusterCard';
import EventDetailModal from '@/components/EventDetailModal';
import { EventCluster } from '@/lib/clustering/types';

export default function BreakingPage() {
  const { 
    eventClusters, 
    searchQuery, 
    selectedCluster, 
    setSelectedCluster, 
    isClusterDetailOpen, 
    setIsClusterDetailOpen 
  } = usePulse();

  const filteredClusters = eventClusters.filter(cluster => {
    const isBreaking = cluster.publisherCount > 1 || cluster.topSelectionScore >= 80;
    const matchesSearch = searchQuery === '' || 
      cluster.canonicalHeadline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return isBreaking && matchesSearch;
  });

  const handleSelectCluster = (cluster: EventCluster) => {
    setSelectedCluster(cluster);
    setIsClusterDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">Breaking Event Clusters</h1>
            <p className="text-xs text-zinc-500">MULTI-PUBLISHER CORROBORATED DEVELOPMENTS // HIGH SIGNAL EVENTS</p>
          </div>
        </div>

        <span className="text-xs font-mono text-rose-400 font-bold bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
          {filteredClusters.length} Breaking Events
        </span>
      </div>

      {filteredClusters.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-lg p-12 text-center font-mono text-zinc-500 text-xs">
          No multi-publisher Breaking Event Clusters currently active.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClusters.map((cluster) => (
            <EventClusterCard
              key={cluster.clusterId}
              cluster={cluster}
              onSelectCluster={handleSelectCluster}
            />
          ))}
        </div>
      )}

      <EventDetailModal
        cluster={selectedCluster}
        isOpen={isClusterDetailOpen}
        onClose={() => setIsClusterDetailOpen(false)}
      />
    </div>
  );
}
