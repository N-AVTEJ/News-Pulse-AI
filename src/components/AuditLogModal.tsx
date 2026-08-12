'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, RefreshCw } from 'lucide-react';
import { AuditLogEntry } from '@/lib/enterprise/types';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditLogModal({ isOpen, onClose }: AuditLogModalProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadLogs() {
      setIsLoading(true);
      try {
        const url = actionFilter !== 'ALL' ? `/api/audit?action=${actionFilter}` : '/api/audit';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setLogs(data.logs || []);
          }
        }
      } catch (err) {
        console.error('[AuditLogModal] Failed to fetch audit logs:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, [isOpen, actionFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Enterprise Immutable Audit Trail</h2>
              <p className="text-xs text-zinc-500">AUDIT LOGS // USER ACTIONS & PRIVILEGE TELEMETRY</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 uppercase font-bold">Action Filter:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold px-3 py-1.5 rounded focus:outline-none focus:border-zinc-700"
            >
              <option value="ALL">ALL ACTIONS</option>
              <option value="CREATE_INVESTIGATION">CREATE INVESTIGATION</option>
              <option value="UPDATE_INVESTIGATION_STATUS">UPDATE INVESTIGATION STATUS</option>
              <option value="CREATE_TASK">CREATE TASK</option>
              <option value="UPDATE_TASK_STATUS">UPDATE TASK STATUS</option>
              <option value="POST_COMMENT">POST COMMENT</option>
            </select>
          </div>

          <span className="text-xs text-zinc-500">{logs.length} Immutable Logs</span>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-8 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading audit log entries...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
            No audit logs recorded for filter &quot;{actionFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-850 rounded-lg bg-zinc-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/50 border-b border-zinc-850 text-[10px] text-zinc-400 uppercase">
                <tr>
                  <th className="p-3 font-bold">Timestamp</th>
                  <th className="p-3 font-bold">User</th>
                  <th className="p-3 font-bold">Role</th>
                  <th className="p-3 font-bold">Action</th>
                  <th className="p-3 font-bold">Target Resource</th>
                  <th className="p-3 font-bold">New Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-3 text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3 text-zinc-200 font-bold">{log.userName}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-zinc-900 border border-zinc-800 text-indigo-400 font-bold">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3 text-amber-400 font-bold">{log.action}</td>
                    <td className="p-3 text-indigo-400">{log.targetResource}</td>
                    <td className="p-3 text-zinc-300 font-sans">{log.newValue || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
