"use client";

import React from "react";
import { CheckCircle2, Loader2, Circle, ArrowRight } from "lucide-react";

export interface StepItem {
  id: string | number;
  title: string;
  detail?: string;
  status: "completed" | "in_progress" | "pending" | "failed";
  timestampMs?: number;
}

interface ExecutionStepperProps {
  steps: StepItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const ExecutionStepper: React.FC<ExecutionStepperProps> = ({
  steps,
  orientation = "horizontal",
  className = "",
}) => {
  if (orientation === "horizontal") {
    return (
      <div className={`p-4 rounded-xl bg-[#1E293B] border border-[#334155] ${className}`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 overflow-x-auto py-1">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const isCompleted = step.status === "completed";
            const isInProgress = step.status === "in_progress";
            const isFailed = step.status === "failed";

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex-1 min-w-[140px] p-3 rounded-xl border transition-colors ${
                    isCompleted
                      ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                      : isInProgress
                      ? "bg-[#4F46E5]/10 border-[#4F46E5]/40 text-[#F8FAFC]"
                      : isFailed
                      ? "bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]"
                      : "bg-[#0F172A]/50 border-[#334155]/40 text-[#64748B]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-semibold uppercase text-[#94A3B8]">
                      Step {idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    ) : isInProgress ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#06B6D4] animate-spin shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#F8FAFC] truncate">
                    {step.title}
                  </div>
                  {step.detail && (
                    <div className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                      {step.detail}
                    </div>
                  )}
                </div>

                {!isLast && (
                  <ArrowRight className="w-4 h-4 text-[#475569] shrink-0 hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 p-4 rounded-xl bg-[#1E293B] border border-[#334155] ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = step.status === "completed";
        const isInProgress = step.status === "in_progress";
        const isFailed = step.status === "failed";

        return (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
              isCompleted
                ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                : isInProgress
                ? "bg-[#4F46E5]/10 border-[#4F46E5]/40 text-[#F8FAFC]"
                : isFailed
                ? "bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]"
                : "bg-[#0F172A]/40 border-transparent text-[#64748B]"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              ) : isInProgress ? (
                <Loader2 className="w-4 h-4 text-[#06B6D4] animate-spin" />
              ) : (
                <Circle className="w-4 h-4 text-[#64748B]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                  {step.title}
                </span>
                {step.timestampMs !== undefined && isCompleted && (
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {step.timestampMs}ms
                  </span>
                )}
              </div>
              {step.detail && (
                <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
