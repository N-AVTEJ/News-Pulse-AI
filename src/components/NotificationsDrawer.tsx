'use client';

import React, { useState } from 'react';
import { X, Bell, AlertTriangle, ShieldCheck, FileText, CheckCircle2, Filter } from 'lucide-react';
import { NotificationItem, UserNotificationPreferences } from '@/lib/runtime/types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectCluster: (clusterId: string) => void;
}

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectCluster
}: NotificationsDrawerProps) {
  const [prefs, setPrefs] = useState<UserNotificationPreferences>({
    aiTech: true,
    business: true,
    world: true,
    breakingOnly: false,
    officialAnnouncementsOnly: false
  });

  const [showFilters, setShowFilters] = useState(false);

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (prefs.breakingOnly && n.type !== 'BREAKING_EVENT') return false;
    if (prefs.officialAnnouncementsOnly && n.type !== 'PRIMARY_STATEMENT_ADDED') return false;
    if (n.category === 'ai-tech' && !prefs.aiTech) return false;
    if (n.category === 'business' && !prefs.business) return false;
    if (n.category === 'world' && !prefs.world) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'BREAKING_EVENT': return AlertTriangle;
      case 'VERIFICATION_UPGRADE': return ShieldCheck;
      case 'PRIMARY_STATEMENT_ADDED': return FileText;
      default: return CheckCircle2;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'BREAKING_EVENT': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'VERIFICATION_UPGRADE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PRIMARY_STATEMENT_ADDED': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm font-mono animate-fadeIn">
      <div 
        className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-5 h-full overflow-y-auto space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-zinc-100 uppercase">Intelligence Notifications</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preference Filters Toggle Panel */}
        {showFilters && (
          <div className="p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-850 text-xs space-y-2">
            <span className="font-bold text-zinc-300 uppercase block mb-1">Notification Filters</span>
            
            <label className="flex items-center justify-between text-zinc-400 cursor-pointer">
              <span>Breaking Events Only</span>
              <input
                type="checkbox"
                checked={prefs.breakingOnly}
                onChange={(e) => setPrefs({ ...prefs, breakingOnly: e.target.checked })}
                className="rounded bg-zinc-900 border-zinc-700 text-indigo-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between text-zinc-400 cursor-pointer">
              <span>Official Statements Only</span>
              <input
                type="checkbox"
                checked={prefs.officialAnnouncementsOnly}
                onChange={(e) => setPrefs({ ...prefs, officialAnnouncementsOnly: e.target.checked })}
                className="rounded bg-zinc-900 border-zinc-700 text-indigo-500 focus:ring-0"
              />
            </label>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{filtered.length} Notification(s)</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-indigo-400 hover:underline font-bold"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
            No notifications matching current filter settings.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const Icon = getIcon(item.type);
              const badgeClass = getBadgeColor(item.type);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectCluster(item.clusterId)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-200 hover:border-zinc-700 space-y-1.5 ${
                    item.read ? 'bg-zinc-950 border-zinc-900 opacity-75' : 'bg-zinc-900/50 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border flex items-center gap-1 ${badgeClass}`}>
                      <Icon className="w-3 h-3" />
                      {item.type.replace(/_/g, ' ')}
                    </span>

                    <span className="text-[10px] text-zinc-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-100 font-sans leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    {item.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
