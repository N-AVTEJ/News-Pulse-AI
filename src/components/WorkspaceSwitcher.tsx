'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { Workspace } from '@/lib/personalization/types';

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSwitchWorkspace: (workspaceId: string) => void;
}

export default function WorkspaceSwitcher({
  workspaces,
  activeWorkspace,
  onSwitchWorkspace
}: WorkspaceSwitcherProps) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <Layers className="w-4 h-4 text-indigo-400" />
      <span className="text-zinc-500 hidden sm:inline uppercase">Workspace:</span>
      <select
        value={activeWorkspace.id}
        onChange={(e) => onSwitchWorkspace(e.target.value)}
        className="bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold px-2.5 py-1 rounded-md focus:outline-none focus:border-zinc-700 cursor-pointer hover:border-zinc-700 transition-colors"
      >
        {workspaces.map((ws) => (
          <option key={ws.id} value={ws.id}>
            {ws.name} ({ws.type})
          </option>
        ))}
      </select>
    </div>
  );
}
