"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  ExternalLink
} from "lucide-react";
import { GovernanceValidationResult } from "@/types/impact";

interface GovernanceValidationProps {
  validation: GovernanceValidationResult;
  metricName: string;
}

export const GovernanceValidation: React.FC<GovernanceValidationProps> = ({
  validation,
  metricName
}) => {
  return (
    <div
      className={`rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4 border ${
        validation.blocked
          ? "bg-rose-950/20 border-rose-500/50"
          : "bg-slate-900/90 border-slate-800"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 18 • Semantic Governance Assertion Gate
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            {validation.blocked ? (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            Semantic Governance Integrity Check
          </h3>
        </div>

        <div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
              validation.blocked
                ? "bg-rose-500/15 text-rose-300 border-rose-500/40 animate-pulse"
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            }`}
          >
            {validation.blocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>SIMULATION BLOCKED</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>GOVERNANCE PASSED</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Block Alert Banner if blocked */}
      {validation.blocked && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Simulation Execution Prevented by Governance Rules</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">
            {validation.block_reason || "Invalid semantic measures or syntax detected."}
          </p>
          <p className="text-[11px] text-slate-400">
            MetricMind strictly blocks unregistered measures from entering simulation to prevent rogue metric pollution.
          </p>
        </div>
      )}

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {validation.checks.map((check) => (
          <div
            key={check.id}
            className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
              check.passed
                ? "bg-slate-950/60 border-slate-800/80"
                : "bg-rose-950/20 border-rose-500/40"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {check.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-200">{check.name}</h5>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    check.passed
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-rose-400 bg-rose-500/10"
                  }`}
                >
                  {check.passed ? "Verified" : "Failed"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed truncate">
                {check.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
