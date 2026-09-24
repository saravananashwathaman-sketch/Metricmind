"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Edit3,
  Check,
  X,
  ShieldCheck,
  Lock,
  Plus,
  RefreshCw,
  Clock,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { Role } from "@/types";

interface SemanticAdminViewProps {
  userRole: Role;
}

export const SemanticAdminView: React.FC<SemanticAdminViewProps> = ({ userRole }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMetric, setEditingMetric] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const canEdit = userRole === "Admin";

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/metrics");
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load metrics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMetric) return;

    try {
      const res = await fetch(`/api/metrics/${editingMetric.metric_name}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: editingMetric.display_name,
          description: editingMetric.description,
          formula_sql: editingMetric.formula_sql,
          owner_team: editingMetric.owner_team
        })
      });
      if (res.ok) {
        setSaveSuccess(`Metric '${editingMetric.display_name}' updated to version ${editingMetric.version + 1}!`);
        setTimeout(() => setSaveSuccess(null), 3000);
        setEditingMetric(null);
        loadMetrics();
      }
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            Semantic Layer Administration & Metric Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Governed definitions table (metric_definitions). The AI must not invent alternative definitions when an approved metric exists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit ? (
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Mode: Editing Enabled</span>
            </span>
          ) : (
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Read-Only ({userRole})</span>
            </span>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Metric Definitions Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Approved Enterprise Business Metrics
          </h3>
          <span className="text-[10px] text-slate-500">{metrics.length} Definitions Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="px-3.5 py-3">Metric Name</th>
                <th className="px-3.5 py-3">Governed Formula (SQL)</th>
                <th className="px-3.5 py-3">Owner Team</th>
                <th className="px-3.5 py-3">Version</th>
                <th className="px-3.5 py-3">Allowed Dimensions</th>
                <th className="px-3.5 py-3">Status</th>
                {canEdit && <th className="px-3.5 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {metrics.map((m) => (
                <tr key={m.metric_id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="px-3.5 py-3 font-semibold text-slate-100">
                    <div>{m.display_name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{m.metric_name}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-sky-300 text-[11px] max-w-xs truncate">
                    {m.formula_sql}
                  </td>
                  <td className="px-3.5 py-3 text-slate-300">
                    {m.owner_team}
                  </td>
                  <td className="px-3.5 py-3 font-mono text-slate-400">
                    v{m.version}
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="text-[10px] text-slate-400">
                      {m.allowed_dimensions?.length || 9} dimensions
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </td>
                  {canEdit && (
                    <td className="px-3.5 py-3 text-right">
                      <button
                        onClick={() => setEditingMetric({ ...m })}
                        className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Metric Modal/Drawer if open */}
      {editingMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase">Edit Governed Metric</span>
                <h3 className="text-base font-bold text-slate-100">{editingMetric.display_name}</h3>
              </div>
              <button
                onClick={() => setEditingMetric(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Display Name</label>
                <input
                  type="text"
                  value={editingMetric.display_name}
                  onChange={(e) => setEditingMetric({ ...editingMetric, display_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Governed Formula (SQL Expression)</label>
                <textarea
                  rows={2}
                  value={editingMetric.formula_sql}
                  onChange={(e) => setEditingMetric({ ...editingMetric, formula_sql: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sky-300 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={editingMetric.description}
                  onChange={(e) => setEditingMetric({ ...editingMetric, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Owner Team</label>
                <input
                  type="text"
                  value={editingMetric.owner_team}
                  onChange={(e) => setEditingMetric({ ...editingMetric, owner_team: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingMetric(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20"
              >
                Save Governed Definition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
