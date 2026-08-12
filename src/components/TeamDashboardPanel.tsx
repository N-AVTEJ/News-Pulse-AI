'use client';

import React from 'react';
import { ShieldCheck, CheckSquare, Users, ShieldAlert, ChevronRight } from 'lucide-react';
import { Investigation, CollaborativeTask, Organization } from '@/lib/enterprise/types';

interface TeamDashboardPanelProps {
  organization?: Organization | null;
  investigations: Investigation[];
  tasks: CollaborativeTask[];
  onOpenInvestigations: () => void;
  onOpenTasks: () => void;
  onOpenAudit: () => void;
}

export default function TeamDashboardPanel({
  organization,
  investigations,
  tasks,
  onOpenInvestigations,
  onOpenTasks,
  onOpenAudit
}: TeamDashboardPanelProps) {
  const activeInvestigationsCount = investigations.filter(i => i.status === 'ACTIVE' || i.status === 'OPEN').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
  const memberCount = organization?.members.length || 3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
      
      {/* Widget 1: Open Investigations */}
      <div 
        onClick={onOpenInvestigations}
        className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer space-y-2 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-indigo-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Investigations ({activeInvestigationsCount})
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">
          {investigations[0]?.title || 'Datacenter GPU & Trade Secret Investigations'}
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          {investigations.length} strategic threat investigations active across enterprise desks.
        </p>

        <span className="text-[10px] text-indigo-400 font-bold underline inline-block pt-1">
          Open Investigations Board →
        </span>
      </div>

      {/* Widget 2: Assigned Tasks */}
      <div 
        onClick={onOpenTasks}
        className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer space-y-2 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            Assigned Tasks ({pendingTasksCount})
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">
          {tasks[0]?.title || 'Analyst Verification Tasks'}
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          Collaborative analyst tasks with evidence checklists & due dates.
        </p>

        <span className="text-[10px] text-emerald-400 font-bold underline inline-block pt-1">
          Open Task Board →
        </span>
      </div>

      {/* Widget 3: Organization & Audit Trail */}
      <div 
        onClick={onOpenAudit}
        className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer space-y-2 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Org Roster ({memberCount} Analysts)
          </span>
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h4 className="text-xs font-bold text-zinc-100 font-sans line-clamp-1">
          {organization?.name || 'NewsPulse Global Intelligence'}
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          RBAC Roles: Owner, Admin, Manager, Analyst, Researcher. Audit trail active.
        </p>

        <span className="text-[10px] text-amber-400 font-bold underline inline-block pt-1">
          View Audit Logs →
        </span>
      </div>

    </div>
  );
}
