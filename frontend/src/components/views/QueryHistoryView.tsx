"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Layers,
  Sparkles
} from "lucide-react";
import { QueryHistoryItem } from "@/types";
import { api } from "@/lib/api";
import { INITIAL_QUERY_HISTORY } from "@/lib/mockData";

interface QueryHistoryViewProps {
  onAskQuestion: (q: string) => void;
}

export const QueryHistoryView: React.FC<QueryHistoryViewProps> = ({
  onAskQuestion
}) => {
  const [historyItems, setHistoryItems] = useState<QueryHistoryItem[]>(INITIAL_QUERY_HISTORY);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const list = await api.getQueryHistory();
    setHistoryItems(list);
  };

  const filtered = historyItems.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.metric_used.toLowerCase().includes(search.toLowerCase()) ||
    item.user_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-sky-400" />
            Natural Language Query History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of all natural language questions executed through MetricMind&apos;s semantic engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-3.5 py-3">Question</th>
                <th className="px-3.5 py-3">Governed Metric</th>
                <th className="px-3.5 py-3">User & Role</th>
                <th className="px-3.5 py-3">Latency</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3">Timestamp</th>
                <th className="px-3.5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="px-3.5 py-3 text-slate-100 font-semibold max-w-xs truncate">
                    &quot;{item.question}&quot;
                  </td>
                  <td className="px-3.5 py-3 font-mono text-sky-400">
                    {item.metric_used}
                  </td>
                  <td className="px-3.5 py-3 text-slate-300">
                    <div className="font-medium">{item.user_name}</div>
                    <div className="text-[10px] text-slate-500">{item.user_role}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-slate-400">
                    {item.execution_ms}ms
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-slate-500 text-[11px]">
                    {item.created_at}
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <button
                      onClick={() => onAskQuestion(item.question)}
                      className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-bold px-2 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition-colors"
                    >
                      <span>Re-run</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
