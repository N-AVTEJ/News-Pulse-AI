'use client';

import React from 'react';
import { Layers, Globe, Clock, Shield, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { EventCluster } from '@/lib/clustering/types';
import ExplainableRelevanceBadge from './ExplainableRelevanceBadge';

interface EventClusterCardProps {
  cluster: EventCluster;
  onSelectCluster: (cluster: EventCluster) => void;
}

export default function EventClusterCard({ cluster, onSelectCluster }: EventClusterCardProps) {
  const isMultiScout = cluster.matchedScouts.length > 1;
  const breakingState = cluster.breakingState || 'DEVELOPING';

  const formattedLatestTime = (() => {
    try {
      const date = new Date(cluster.latestPublished);
      if (isNaN(date.getTime())) return cluster.latestPublished;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return cluster.latestPublished;
    }
  })();

  const getBreakingBadge = (state: string) => {
    switch (state) {
      case 'BREAKING':
        return {
          label: 'BREAKING NEWS',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse',
          icon: AlertTriangle
        };
      case 'CONFIRMED':
        return {
          label: 'CONFIRMED EVENT',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2
        };
      case 'ARCHIVED':
        return {
          label: 'ARCHIVED',
          bg: 'bg-zinc-900 border-zinc-800 text-zinc-500',
          icon: Clock
        };
      case 'DEVELOPING':
      default:
        return {
          label: 'DEVELOPING',
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          icon: Layers
        };
    }
  };

  const badge = getBreakingBadge(breakingState);
  const BadgeIcon = badge.icon;

  return (
    <div 
      onClick={() => onSelectCluster(cluster)}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 font-mono space-y-4"
    >
      {/* Accent top border if breaking or multi-publisher */}
      {breakingState === 'BREAKING' ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse"></div>
      ) : cluster.publisherCount > 1 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"></div>
      )}

      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap text-[10px]">
          {/* Explainable Relevance Badge */}
          <ExplainableRelevanceBadge
            score={cluster.relevanceScore || 65}
            reasons={cluster.matchReasons || ['Matched Category Preference']}
          />

          {/* Breaking Lifecycle Badge */}
          <span className={`px-2 py-0.5 rounded font-bold uppercase border flex items-center gap-1 ${badge.bg}`}>
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </span>

          {/* Cluster Article Count Pill */}
          <span className="px-2 py-0.5 rounded font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            {cluster.storyCount} {cluster.storyCount === 1 ? 'Article' : 'Articles'}
          </span>

          {/* Publisher Count Pill */}
          <span className="px-2 py-0.5 rounded font-bold uppercase bg-zinc-900 border border-zinc-800 text-zinc-300">
            {cluster.publisherCount} {cluster.publisherCount === 1 ? 'Publisher' : 'Publishers'}
          </span>

          {/* Cross-Scout Detection Badge */}
          {isMultiScout && (
            <span className="px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Detected by {cluster.matchedScouts.length} Scouts
            </span>
          )}
        </div>

        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-zinc-600" />
          {formattedLatestTime}
        </span>
      </div>

      {/* Canonical Headline */}
      <h3 className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-2 font-sans leading-snug">
        {cluster.canonicalHeadline}
      </h3>

      {/* Summary Snippet */}
      {cluster.summary && (
        <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2 font-sans">
          {cluster.summary}
        </p>
      )}

      {/* Publisher Roster Badges */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-900 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          {cluster.publishers.map((pub) => (
            <span key={pub} className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-300">
              {pub}
            </span>
          ))}
        </div>

        <span className="text-[11px] text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
          View Event Details
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
