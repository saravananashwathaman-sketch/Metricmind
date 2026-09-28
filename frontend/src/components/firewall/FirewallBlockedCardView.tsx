"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldX,
  XCircle,
  AlertTriangle,
  Database,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  Lock,
  CheckCircle2,
  Layers,
  Sparkles
} from "lucide-react";
import { FirewallBlockedCard, FirewallDecision } from "@/types/firewall";

interface FirewallBlockedCardViewProps {
  blockedCard: FirewallBlockedCard;
  decision?: FirewallDecision;
  onAskAlternative?: (altQuestion: string) => void;
  onViewFirewallDashboard?: () => void;
}

export const FirewallBlockedCardView: React.FC<FirewallBlockedCardViewProps> = ({
  blockedCard,
  decision,
  onAskAlternative,
  onViewFirewallDashboard
}) => {
  const [showStages, setShowStages] = useState(false);

  const getStageIcon = (stage?: string) => {
    switch (stage) {
      case "SQL_DETECTION":
      case "RAW SQL FIREWALL":
        return <Terminal className="w-5 h-5 text-rose-400" />;
      case "PERMISSION_VALIDATION":
      case "PERMISSION VALIDATION":
        return <Lock className="w-5 h-5 text-amber-400" />;
      case "METRIC_VALIDATION":
      case "METRIC VALIDATION":
        return <Database className="w-5 h-5 text-purple-400" />;
      case "DIMENSION_VALIDATION":
      case "DIMENSION VALIDATION":
        return <Layers className="w-5 h-5 text-indigo-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="rounded-3xl bg-slate-950 border-2 border-rose-500/40 shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border-b border-rose-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
            {getStageIcon(blockedCard.validation_stage)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-rose-300 tracking-wide flex items-center gap-1.5 uppercase">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                AI Hallucination Firewall
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-rose-500/20 text-rose-200 border border-rose-500/40 uppercase">
                REQUEST BLOCKED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Zero-Trust Enforcement: The untrusted AI query was intercepted before reaching data sources.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-black/60 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Cube API: NOT SENT</span>
          </span>
        </div>
      </div>

      {/* Main Terminal-Style Block Box (Matching Section 5 & 24) */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="p-5 rounded-2xl bg-black/80 border border-rose-500/30 font-mono text-xs space-y-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="text-rose-400 font-bold tracking-wider">GATEWAY INTERCEPT REPORT</span>
            <span className="text-slate-500">{decision?.request_id || "REQ-FIREWALL-BLOCK"}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
              Intercept Target / Offending Entity:
            </span>
            <span className="text-sm font-black text-rose-300 font-mono bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 inline-block">
              {blockedCard.target}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
              Governance Violation Reason:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {blockedCard.reason}
            </p>
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
              Firewall Explanation:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {blockedCard.explanation}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="text-slate-500">Validation Stage:</span>
              <span className="text-sky-300 font-bold uppercase">{blockedCard.validation_stage}</span>
            </span>
            <span className="text-rose-400 font-bold">
              Database Access: PROHIBITED
            </span>
          </div>
        </div>

        {/* Available Approved Alternatives (Section 9 & 24) */}
        {blockedCard.available_alternatives && blockedCard.available_alternatives.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Available Governed Alternatives in Catalog:
            </div>
            <div className="flex flex-wrap gap-2">
              {blockedCard.available_alternatives.map((alt, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskAlternative?.(`Show me ${alt.toLowerCase()}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-sky-500/10 border border-slate-800 hover:border-sky-500/30 text-xs font-medium text-slate-300 hover:text-sky-200 transition-all flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>{alt}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Validation Chain Inspector Accordion */}
        {decision?.stages && decision.stages.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setShowStages(!showStages)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>View 16-Stage Validation Pipeline Trace ({decision.stages.length} evaluated)</span>
              </span>
              {showStages ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showStages && (
              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-2.5 animate-in fade-in duration-150">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Sequential Execution Pipeline (Halted on First Failure)
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {decision.stages.map((stg, i) => (
                    <div
                      key={stg.id || i}
                      className={`flex items-center justify-between p-2 rounded-lg border ${
                        stg.status === "PASSED"
                          ? "bg-emerald-500/5 border-emerald-500/20 text-slate-300"
                          : stg.status === "BLOCKED"
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-200 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {stg.status === "PASSED" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span>{stg.display_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">{stg.latency_ms}ms</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};
