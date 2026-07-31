'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import EventClusterCard from '@/components/EventClusterCard';
import EventDetailModal from '@/components/EventDetailModal';
import { EventCluster } from '@/lib/clustering/types';

export default function SavedPage() {
  const { 
    eventClusters, 
    savedStories, 
    searchQuery, 
    selectedCluster, 
    setSelectedCluster, 
    isClusterDetailOpen, 
    setIsClusterDetailOpen 
  } = usePulse();

  const filteredClusters = eventClusters.filter(cluster => {
    const isSaved = cluster.stories.some(s => savedStories.includes(s.id)) || savedStories.includes(cluster.clusterId);
    const matchesSearch = searchQuery === '' || 
      cluster.canonicalHeadline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return isSaved && matchesSearch;
  });

  const handleSelectCluster = (cluster: EventCluster) => {
    setSelectedCluster(cluster);
    setIsClusterDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">Saved Event Dossiers</h1>
            <p className="text-xs text-zinc-500">BOOKMARKED INTELLIGENCE EVENT CLUSTERS</p>
          </div>
        </div>

        <span className="text-xs font-mono text-indigo-400 font-bold bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
          {filteredClusters.length} Saved
        </span>
      </div>

      {filteredClusters.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-lg p-12 text-center font-mono text-zinc-500 text-xs">
          No saved Event Clusters yet. Click the bookmark icon on any story or cluster to save for reference.
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
