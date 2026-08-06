'use client';

import React from 'react';
import { Play, Activity, Bell } from 'lucide-react';
import { HealthMetrics } from '@/lib/runtime/types';

interface PipelineStatusBannerProps {
  health?: HealthMetrics | null;
  isRunningPipeline: boolean;
  onTriggerRun: () => void;
  onOpenHealth: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export default function PipelineStatusBanner({
  health,
  isRunningPipeline,
  onTriggerRun,
  onOpenHealth,
  onOpenNotifications,
  unreadNotificationsCount
}: PipelineStatusBannerProps) {
  const schedulerMode = health?.schedulerMode || 'INTERVAL';
  const workersActive = health?.workersActive || 0;
  const queueLength = health?.queueLength || 0;
  const avgTime = health?.averageExecutionTimeMs || 0;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono space-y-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2">
        
        {/* Left Status Indicators */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2.5 w-2.5`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunningPipeline ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunningPipeline ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
              {isRunningPipeline ? 'AUTONOMOUS PIPELINE EXECUTING...' : 'PIPELINE ACTIVE'}
            </span>
          </div>

          {/* Mode Pill */}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-indigo-400 uppercase">
            MODE: {schedulerMode}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Notifications Trigger Button */}
          <button
            onClick={onOpenNotifications}
            className="relative px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-indigo-400" />
            <span>Alerts</span>
            {unreadNotificationsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Health & History Drawer Button */}
          <button
            onClick={onOpenHealth}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Health & History</span>
          </button>

          {/* Manual Run Trigger */}
          <button
            onClick={onTriggerRun}
            disabled={isRunningPipeline}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningPipeline ? 'animate-spin' : ''}`} />
            <span>{isRunningPipeline ? 'RUNNING...' : 'RUN PIPELINE NOW'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs pt-1">
        <div className="p-2 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Active Workers</span>
          <strong className="text-zinc-200 font-bold">{workersActive} Workers</strong>
        </div>

        <div className="p-2 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Queue Length</span>
          <strong className="text-zinc-200 font-bold">{queueLength} Jobs</strong>
        </div>

        <div className="p-2 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Average Latency</span>
          <strong className="text-emerald-400 font-bold">{avgTime}ms</strong>
        </div>

        <div className="p-2 rounded bg-zinc-900/40 border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase block">Source Availability</span>
          <strong className="text-emerald-400 font-bold">{health?.sourceAvailabilityPercentage ?? 100}%</strong>
        </div>
      </div>
    </div>
  );
}
