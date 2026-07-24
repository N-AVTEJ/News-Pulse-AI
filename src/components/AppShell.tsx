'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Radio, Cpu, TrendingUp, Globe, Bookmark, Bot, Database, Sliders,
  Search, Bell, User, RefreshCw, Menu, X, Activity, Circle, Terminal
} from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import StoryDetail from './StoryDetail';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    searchQuery, setSearchQuery, 
    selectedStory, setSelectedStory, 
    isDetailOpen, setIsDetailOpen, 
    savedStories, toggleSave, stories,
    lastScanTime, triggerManualScan, isScanning 
  } = usePulse();

  const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Breaking', href: '/breaking', icon: Radio, countBadge: stories.filter(s => s.isBreaking).length },
    { name: 'AI & Tech', href: '/ai-tech', icon: Cpu },
    { name: 'Business', href: '/business', icon: TrendingUp },
    { name: 'World', href: '/world', icon: Globe },
    { name: 'Saved', href: '/saved', icon: Bookmark, countBadge: savedStories.length },
    { name: 'Agents', href: '/agents', icon: Bot },
    { name: 'Sources', href: '/sources', icon: Database },
    { name: 'Settings', href: '/settings', icon: Sliders },
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-900 bg-zinc-950 shrink-0">
        {/* Branding */}
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm text-zinc-100">NewsPulse</span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold block leading-none">AI CORE v1.0</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-md font-mono text-xs font-medium tracking-wide transition-all duration-150 group border ${
                  isActive 
                    ? 'bg-zinc-900 border-zinc-800 text-indigo-400 font-semibold shadow shadow-indigo-500/5' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 hover:border-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.countBadge !== undefined && item.countBadge > 0 && (
                  <span className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded font-mono text-[9px] font-bold ${
                    item.name === 'Breaking' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' 
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                  }`}>
                    {item.countBadge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/80">
          <div className="flex items-center gap-2.5 p-2 rounded bg-zinc-900/30 border border-zinc-900 font-mono text-[10px] text-zinc-500">
            <Terminal className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <div className="leading-tight truncate">
              <span className="text-zinc-400">Node Status: </span>
              <span className="text-emerald-500 font-semibold">SECURE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile drawer backdrop & menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <span className="font-bold tracking-tight text-sm text-zinc-100">NewsPulse AI</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded hover:bg-zinc-900 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md font-mono text-xs font-medium tracking-wide border transition-all ${
                      isActive 
                        ? 'bg-zinc-900 border-zinc-800 text-indigo-400 font-semibold' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.countBadge !== undefined && item.countBadge > 0 && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-zinc-800 text-zinc-400">
                        {item.countBadge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* 3. Main Workspace viewport pane */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top bar header */}
        <header className="flex items-center justify-between px-6 h-16 border-b border-zinc-900 bg-zinc-950 shrink-0 gap-4">
          
          {/* Mobile menu trigger & title */}
          <div className="flex items-center gap-3 lg:hidden shrink-0">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded hover:bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold tracking-tight text-xs text-zinc-300">Pulse AI</span>
          </div>

          {/* Search bar UI */}
          <div className="relative w-full max-w-md hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search intelligence database... (e.g. quantum, bgp, federal)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-3 py-1.5 pl-9 font-mono text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900/80 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Indicators & Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Live active beacon */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold tracking-wider uppercase select-none">
              <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500 animate-pulse" />
              <span className="hidden md:inline">Live Intel feed</span>
            </div>

            {/* Scanning status controls */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right font-mono text-[9px] leading-tight text-zinc-500">
                <span>Last Scan</span>
                <span className="text-zinc-400 font-semibold">{lastScanTime}</span>
              </div>
              <button
                onClick={triggerManualScan}
                disabled={isScanning}
                className={`p-1.5 rounded hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 ${isScanning ? 'opacity-80' : ''}`}
                title="Scan Feeds Now"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-indigo-400' : ''}`} />
                <span className="hidden md:inline font-mono text-[10px] font-semibold">SCAN NOW</span>
              </button>
            </div>

            {/* Notification alert badge */}
            <button className="relative p-1.5 rounded hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
            </button>

            {/* User profile dropdown control */}
            <div className="flex items-center gap-2 border-l border-zinc-900 pl-3">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-300 hover:text-zinc-100 cursor-pointer overflow-hidden">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Global Search mobile only row */}
        <div className="block sm:hidden px-6 py-2 border-b border-zinc-900/60 bg-zinc-950/80">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-850 rounded px-2.5 py-1 pl-8 font-mono text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable workspace content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-950">
          {children}
        </main>
      </div>

      {/* Global Dossier Slide-over drawer */}
      <StoryDetail 
        story={selectedStory}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedStory(null);
        }}
        isSaved={selectedStory ? savedStories.includes(selectedStory.id) : false}
        onToggleSave={toggleSave}
        allStories={stories}
        onSelectStory={(newStory) => setSelectedStory(newStory)}
      />
    </div>
  );
}
