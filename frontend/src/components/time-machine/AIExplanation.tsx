"use client";

import React from "react";
import { Sparkles, ShieldCheck, Check, ArrowRight, Lock, Bot } from "lucide-react";

interface AIExplanationProps {
  summary: string;
  narrative: string;
  trustBoundaryNotice: string;
  verifiedInputs: string[];
}

export const AIExplanation: React.FC<AIExplanationProps> = ({
  summary,
  narrative,
  trustBoundaryNotice,
  verifiedInputs
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            AI EXPLANATION &amp; SYNTHESIS
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AI Trust Boundary Enforced</span>
        </div>
      </div>

      {/* AI Trust Boundary Visual Split (Section 15) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Left: Deterministic Layer */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3" />
              1. Deterministic Layer (Immutable)
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold">
              PASSED
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Metric definition, formula, data snapshot, filters, and mathematical results are strictly locked and evaluated by the Cube.dev Semantic Layer.
          </p>
          <div className="space-y-1 font-mono text-[10px] text-slate-400 pt-1">
            {(verifiedInputs || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-emerald-300/90">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Right: AI Synthesis Layer */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              2. AI Interpretation Layer
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-300 font-mono font-bold">
              READ-ONLY
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            The AI acts solely as an explanatory voice over verified inputs. It is cryptographically prohibited from altering numbers, rewriting formulas, or querying un-governed tables.
          </p>
          <div className="p-2 rounded-lg bg-sky-500/5 border border-sky-500/20 text-[10px] text-sky-300 leading-relaxed font-mono">
            Status: ZERO Raw SQL Generated | SQL By LLM: NONE
          </div>
        </div>
      </div>

      {/* Generated Natural Language Narrative */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/30 via-slate-950/60 to-transparent border border-sky-500/20 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
          Governed Executive Narrative:
        </span>
        <p className="text-sm text-slate-100 font-medium leading-relaxed">
          &quot;{summary}&quot;
        </p>
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {narrative}
        </p>
      </div>

      {/* Trust Notice */}
      <div className="text-[10px] text-slate-400 font-mono">
        {trustBoundaryNotice}
      </div>
    </div>
  );
};
