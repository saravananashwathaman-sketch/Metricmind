"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  XCircle,
  Database,
  Layers,
  Lock,
  Clock,
  ExternalLink
} from "lucide-react";
import { FirewallAuditLogEntry, FirewallDecision } from "@/types/firewall";
import { validateThroughFirewall } from "@/lib/firewallEngine";

interface FirewallDetailsModalProps {
  entry: FirewallAuditLogEntry | null;
  onClose: () => void;
}

export const FirewallDetailsModal: React.FC<FirewallDetailsModalProps> = ({
  entry,
  onClose
}) => {
  if (!entry) return null;

  // Re-run or construct complete 16-stage decision trace for the question
  const decision: FirewallDecision = validateThroughFirewall(entry.question, {
    userRole: entry.user_role,
    semanticVersion: entry.semantic_version !== "N/A" ? entry.semantic_version : undefined
  });

  const isApproved = entry.firewall_status === "PASSED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                isApproved
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              {isApproved ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  Firewall Inspection Audit Trail
                </h3>
                <span className="font-mono text-xs text-slate-400">{entry.request_id}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged at {new Date(entry.timestamp).toLocaleString()} • User: {entry.user} ({entry.user_role})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Question & Outcome Banner */}
          <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Original Prompt
            </span>
            <p className="text-sm font-mono text-slate-200 font-semibold">
              &quot;{entry.question}&quot;
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">
                Resolved Metric: <strong className="text-sky-300">{entry.resolved_metric}</strong>
              </span>
              <span className="text-slate-400">
                Cube API Status:{" "}
                <strong className={isApproved ? "text-emerald-400" : "text-rose-400"}>
                  {entry.cube_request_sent}
                </strong>
              </span>
            </div>
          </div>

          {/* Blocked Summary Card (If blocked) */}
          {!isApproved && decision.blocked_card && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-rose-300 text-sm">
                <XCircle className="w-4 h-4" />
                <span>Interception Notice: {decision.blocked_card.reason}</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
                {decision.blocked_card.explanation}
              </p>
            </div>
          )}

          {/* 16-Stage Pipeline Trace */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Complete 16-Point Inspection Pipeline</span>
              <span className="text-[10px] font-mono text-slate-500">
                {decision.stages.filter((s) => s.status === "PASSED").length}/{decision.stages.length} Passed
              </span>
            </div>

            <div className="space-y-1.5">
              {decision.stages.map((stg) => (
                <div
                  key={stg.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    stg.status === "PASSED"
                      ? "bg-slate-950/60 border-slate-800/80 text-slate-300"
                      : "bg-rose-950/20 border-rose-500/30 text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {stg.status === "PASSED" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">{stg.display_name}</div>
                      <div className="text-[11px] text-slate-400">{stg.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500">{stg.latency_ms}ms</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        stg.status === "PASSED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {stg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
