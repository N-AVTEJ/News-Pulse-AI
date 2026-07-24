'use client';

import React, { useState } from 'react';
import { Sliders, RefreshCw, Save, Cpu, Volume2 } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';

export default function SettingsPage() {
  const { agents, toggleAgentStatus } = usePulse();
  const [scanRate, setScanRate] = useState('9s');
  const [logLevel, setLogLevel] = useState('ALL_LOGS');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoPurge, setAutoPurge] = useState(true);

  const handleSave = () => {
    alert('Settings configuration saved successfully to cache [MOCK]');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the mock database?')) {
      alert('Mock telemetry caches flushed. Reloading default states.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 font-mono flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            SYSTEM PARAMETERS
          </h1>
          <p className="text-xs text-zinc-500 font-mono uppercase">Control panel for autonomous scouts operations and user filters</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Telemetry and Frequency Controls */}
        <div className="space-y-6 rounded-lg border border-zinc-900 bg-zinc-900/20 p-5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-850 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Inference Scan Controls
          </h2>

          <div className="space-y-4 font-mono text-xs">
            {/* Scan Frequency */}
            <div className="space-y-1.5">
              <label className="text-zinc-500 block">Agent Check In Interval:</label>
              <select
                value={scanRate}
                onChange={(e) => setScanRate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
              >
                <option value="5s">5 Seconds (Testing Mode)</option>
                <option value="9s">9 Seconds (Standard Mode)</option>
                <option value="30s">30 Seconds (Throttle Mode)</option>
                <option value="manual">Manual Execution Only</option>
              </select>
            </div>

            {/* Log verbosity */}
            <div className="space-y-1.5">
              <label className="text-zinc-500 block">Log Verbosity Level:</label>
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
              >
                <option value="ALL_LOGS">ALL TRACE LOGS (Telemetry)</option>
                <option value="WARNINGS">WARNINGS & CRITICAL EVENTS ONLY</option>
                <option value="ERRORS">ERRORS ONLY</option>
              </select>
            </div>

            {/* Auto purge */}
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <span className="text-zinc-300 block">Log Auto Purge</span>
                <span className="text-[10px] text-zinc-500 block">Cap activity queue at 50 logs.</span>
              </div>
              <input 
                type="checkbox"
                checked={autoPurge}
                onChange={(e) => setAutoPurge(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-indigo-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
              />
            </div>

            {/* System audio */}
            <div className="flex items-center justify-between py-2 border-t border-zinc-900">
              <div className="space-y-0.5">
                <span className="text-zinc-300 block flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                  Terminal Audio Beacons
                </span>
                <span className="text-[10px] text-zinc-500 block">Beep on critical importance incidents.</span>
              </div>
              <input 
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-indigo-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Agent Deployment overrides */}
        <div className="space-y-6 rounded-lg border border-zinc-900 bg-zinc-900/20 p-5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-850 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-rose-500" />
            Agent Dispatch Controls
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Manually enable or disable scout processes. Disabled scouts cease background parsing.
            </p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-900">
                  <span className="font-semibold text-zinc-300">{agent.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 rounded ${agent.status !== 'IDLE' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-900'}`}>
                      {agent.status !== 'IDLE' ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] hover:text-zinc-200 transition-colors"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Primary Action bar */}
      <div className="border-t border-zinc-900 pt-6 flex items-center justify-between gap-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-xs font-mono text-rose-400 font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          RESET SIMULATOR DB
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-xs font-mono text-white font-bold transition-colors shadow-lg shadow-indigo-500/15"
        >
          <Save className="w-3.5 h-3.5" />
          SAVE CHANGES
        </button>
      </div>

    </div>
  );
}
