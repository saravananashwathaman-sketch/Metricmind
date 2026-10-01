"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { QueryHistoryItem } from "@/types";
import { api } from "@/lib/api";
import { INITIAL_QUERY_HISTORY } from "@/lib/mockData";
import { StatusBadge } from "@/components/design-system/StatusBadge";

interface QueryHistoryViewProps {
  onAskQuestion: (q: string) => void;
}

export const QueryHistoryView: React.FC<QueryHistoryViewProps> = ({
  onAskQuestion,
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
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#4F46E5]/15 text-[#818CF8] border border-[#4F46E5]/30">
              Metric Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#4F46E5]" />
            Metric Version History & Query Logs
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Audit trail of natural language questions executed through MetricMind&apos;s governed semantic engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#020617] border border-[#334155] text-xs">
            <Search className="w-3.5 h-3.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Filter history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-[#F8FAFC] placeholder-[#64748B] focus:outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0F172A] text-[#94A3B8] uppercase font-semibold text-[10px] tracking-wider border-b border-[#334155]">
              <tr>
                <th className="px-3.5 py-2.5">Question</th>
                <th className="px-3.5 py-2.5">Governed Metric</th>
                <th className="px-3.5 py-2.5">User & Role</th>
                <th className="px-3.5 py-2.5">Latency</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5">Timestamp</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="px-3.5 py-3 text-[#F8FAFC] font-medium max-w-xs truncate">
                    &quot;{item.question}&quot;
                  </td>
                  <td className="px-3.5 py-3 font-mono text-[#06B6D4]">
                    {item.metric_used}
                  </td>
                  <td className="px-3.5 py-3 text-[#F8FAFC]">
                    <div className="font-medium">{item.user_name}</div>
                    <div className="text-[10px] text-[#64748B]">{item.user_role}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-[#94A3B8]">
                    {item.execution_ms}ms
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status="verified" label={item.status} />
                  </td>
                  <td className="px-3.5 py-3 text-[#64748B] text-[11px]">
                    {item.created_at}
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onAskQuestion(item.question)}
                      className="inline-flex items-center gap-1 text-xs text-[#4F46E5] hover:text-[#818CF8] font-semibold px-2.5 py-1 rounded-lg bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 border border-[#4F46E5]/30 transition-colors cursor-pointer"
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
