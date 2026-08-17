'use client';

import React, { useState } from 'react';
import { X, Puzzle, ShieldCheck, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { PluginInstance } from '@/lib/platform/types';

interface PluginRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  plugins: PluginInstance[];
  onToggleStatus: (pluginId: string, enabled: boolean) => Promise<void>;
  onRegisterPlugin: (manifest: unknown) => Promise<void>;
}

export default function PluginRegistryModal({
  isOpen,
  onClose,
  plugins,
  onToggleStatus,
  onRegisterPlugin
}: PluginRegistryModalProps) {
  const [manifestJson, setManifestJson] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const parsed = JSON.parse(manifestJson);
      await onRegisterPlugin(parsed);
      setManifestJson('');
      setShowRegister(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Platform Plugin SDK & Catalog</h2>
              <p className="text-xs text-zinc-500">CAPABILITY-BASED SANDBOXED EXTENSIONS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRegister(!showRegister)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Plugin</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Register Form */}
        {showRegister && (
          <form onSubmit={handleRegister} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase">Register New Extension Plugin (Manifest JSON)</h3>

            {errorMsg && (
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <textarea
              rows={6}
              placeholder='{\n  "id": "plugin_custom_exporter",\n  "name": "Custom CSV Exporter",\n  "version": "1.0.0",\n  "author": "Data Team",\n  "category": "EXPORT_PROVIDER",\n  "permissions": ["READ_NEWS"],\n  "capabilities": ["Export verified news to CSV"],\n  "supportedPlatformVersion": "1.0.0",\n  "entryPoint": "index.js",\n  "description": "Exports news data."\n}'
              value={manifestJson}
              onChange={(e) => setManifestJson(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-700"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Validate & Register
              </button>
            </div>
          </form>
        )}

        {/* Plugin Cards */}
        <div className="space-y-3">
          {plugins.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No platform plugins registered.
            </div>
          ) : (
            plugins.map((plugin) => (
              <div key={plugin.manifest.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 font-bold uppercase border border-indigo-500/20">
                      {plugin.manifest.category}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-100 font-sans">{plugin.manifest.name}</h3>
                    <span className="text-[10px] text-zinc-500">v{plugin.manifest.version}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(plugin.manifest.id, !plugin.enabled)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                        plugin.enabled ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                      }`}
                    >
                      {plugin.enabled ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">{plugin.manifest.description}</p>

                {/* Sandbox Permissions */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900 pt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Granted Sandbox Capabilities:</span>
                    {plugin.manifest.permissions.map(p => (
                      <span key={p} className="px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-850 text-indigo-300 font-mono">
                        {p}
                      </span>
                    ))}
                  </div>

                  <span>Author: <strong className="text-zinc-300">{plugin.manifest.author}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Plugin Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
