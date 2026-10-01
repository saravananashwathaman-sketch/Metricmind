"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Circle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { AgentStep } from "@/types";

interface ReasoningProgressProps {
  steps: AgentStep[];
  currentStepIndex?: number;
  isComplete: boolean;
}

export const ReasoningProgress: React.FC<ReasoningProgressProps> = ({
  steps,
  currentStepIndex = 5,
  isComplete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // High-level safe execution stages
  const safeStages = [
    { id: 1, title: "Intent identified", detail: "Natural language query semantics analyzed" },
    { id: 2, title: "Metric resolved", detail: "Mapped to governed semantic catalog definition" },
    { id: 3, title: "Semantic query validated", detail: "Zero-trust firewall passed without raw SQL" },
    { id: 4, title: "Cube API queried", detail: "Cube semantic load executed on PostgreSQL" },
    { id: 5, title: "Result analyzed", detail: "Variance decomposition and drivers calculated" },
  ];

  return (
    <div className="rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm overflow-hidden transition-all">
      {/* Stepper Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F172A] border-b border-[#334155]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
          <span className="text-xs font-semibold text-[#F8FAFC]">
            Governed Execution Pipeline
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!isComplete ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#06B6D4] font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Reasoning over Governed Semantics...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#10B981] font-medium bg-[#10B981]/10 px-2 py-0.5 rounded-md border border-[#10B981]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Governance Verified
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors cursor-pointer"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Stepper Content */}
      {isExpanded && (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {safeStages.map((stage, idx) => {
              const isStageDone = isComplete || idx < Math.min(safeStages.length, Math.ceil((currentStepIndex / 12) * 5));
              const isStageActive = !isComplete && idx === Math.min(safeStages.length - 1, Math.floor((currentStepIndex / 12) * 5));

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-xl border text-xs transition-colors flex flex-col justify-between space-y-2 ${
                    isStageDone
                      ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                      : isStageActive
                      ? "bg-[#4F46E5]/10 border-[#4F46E5]/40 text-[#F8FAFC]"
                      : "bg-[#0F172A]/40 border-transparent text-[#64748B]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#64748B]">
                      Step {stage.id}
                    </span>
                    {isStageDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    ) : isStageActive ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#06B6D4] animate-spin" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-[#64748B]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#F8FAFC]">
                      {stage.title}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                      {stage.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
