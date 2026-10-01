"use client";

import React from "react";
import { ShieldCheck, Clock, Database, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { GovernanceAuditRecord } from "@/types";

interface QueryAuditProps {
  audit?: GovernanceAuditRecord;
}

export const QueryAudit: React.FC<QueryAuditProps> = ({ audit }) => {
  if (!audit) return null;

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Query Governance Audit Record
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            audit.status === "APPROVED"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
          }`}
        >
          {audit.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Request ID</span>
          <div className="text-sky-300 font-mono font-bold">{audit.request_id}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Queries Budget</span>
          <div className="text-slate-200 font-mono font-bold">{audit.queries_executed}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Execution Time</span>
          <div className="text-slate-200 font-mono">{audit.execution_time_ms} ms</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Complexity</span>
          <div
            className={`font-mono font-bold ${
              audit.query_complexity === "High"
                ? "text-amber-400"
                : audit.query_complexity === "Medium"
                ? "text-sky-400"
                : "text-emerald-400"
            }`}
          >
            {audit.query_complexity}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <span>Result Rows: <strong className="text-slate-200">{audit.result_rows}</strong></span>
          <span>•</span>
          <span>User Role: <strong className="text-slate-200">{audit.user}</strong></span>
        </div>
        {audit.cache_hit && (
          <div className="flex items-center gap-1 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-mono">
            <Zap className="w-3 h-3 text-purple-400" />
            <span>Cache Hit</span>
          </div>
        )}
      </div>
    </div>
  );
};
