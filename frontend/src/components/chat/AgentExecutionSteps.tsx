"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Cpu, ShieldCheck } from "lucide-react";
import { MultiStepAnalysisStep } from "@/types";

interface AgentExecutionStepsProps {
  steps: MultiStepAnalysisStep[];
  isCollapsible?: boolean;
}

export const AgentExecutionSteps: React.FC<AgentExecutionStepsProps> = ({
  steps,
  isCollapsible = true
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden shadow-lg">
      <div
        onClick={() => isCollapsible && setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Analysis Steps
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
            {steps.filter((s) => s.status === "completed").length}/{steps.length} Verified
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 hidden sm:inline">Zero Private CoT</span>
          {isCollapsible && (
            <button className="text-slate-400 hover:text-slate-200">
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-slate-200 font-medium text-[11px] truncate block">
                  {step.title}
                </span>
                {step.detail && (
                  <span className="text-slate-500 text-[10px] truncate block">
                    {step.detail}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
