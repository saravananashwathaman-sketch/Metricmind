"use client";

import React from "react";
import { CheckCircle2, Loader2, Circle, ShieldCheck } from "lucide-react";
import { AgentStep } from "@/types";

interface ReasoningProgressProps {
  steps: AgentStep[];
  currentStepIndex?: number;
  isComplete: boolean;
}

export const ReasoningProgress: React.FC<ReasoningProgressProps> = ({
  steps,
  currentStepIndex = 12,
  isComplete
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/20 shadow-xl backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">
            Agentic Semantic BI Orchestrator
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isComplete ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Reasoning over Governed Semantics...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              100% Governed (Zero Rogue SQL)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        {steps.map((step, idx) => {
          const isDone = isComplete || idx < currentStepIndex;
          const isCurrent = !isComplete && idx === currentStepIndex;

          return (
            <div
              key={step.step_number}
              className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                isDone
                  ? "bg-slate-950/60 border border-slate-800/80 text-slate-200"
                  : isCurrent
                  ? "bg-sky-500/10 border border-sky-500/30 text-sky-200 shadow-sm"
                  : "opacity-40 text-slate-500"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px] truncate">{step.title}</span>
                  {step.timestamp_ms > 0 && isDone && (
                    <span className="text-[9px] font-mono text-slate-500">
                      {step.timestamp_ms}ms
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
