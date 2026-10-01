"use client";

import React from "react";
import { MetricVersion } from "@/types/timeMachine";
import { Calendar, CheckCircle2, ShieldCheck } from "lucide-react";

interface TimeMachineTimelineProps {
  versions: MetricVersion[];
  selectedVersion: string;
  onSelectVersion: (version: string) => void;
  currentPeriodLabel?: string;
}

export const TimeMachineTimeline: React.FC<TimeMachineTimelineProps> = ({
  versions = [],
  selectedVersion,
  onSelectVersion,
}) => {
  const vList = versions || [];

  return (
    <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#4F46E5]" />
          <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
            Metric Version Timeline
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#F8FAFC] bg-[#0F172A] px-2.5 py-0.5 rounded border border-[#334155]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>Active: {selectedVersion}</span>
        </div>
      </div>

      {/* Visual Timeline Track */}
      <div className="relative pt-6 pb-4 px-4 sm:px-8">
        {/* Horizontal Track Bar */}
        <div className="absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 bg-[#334155]" />
        <div
          className="absolute top-1/2 left-8 h-0.5 -translate-y-1/2 bg-[#4F46E5] transition-all duration-300"
          style={{
            width: `${Math.max(
              20,
              ((vList.findIndex((v) => v.version === selectedVersion) + 1) / Math.max(1, vList.length)) * 100 - 15
            )}%`,
          }}
        />

        {/* Timeline Milestones */}
        <div className="relative flex justify-between items-center">
          {vList.map((v, idx) => {
            const isSelected = v.version === selectedVersion;
            const isLatest = idx === vList.length - 1;

            return (
              <button
                key={v.version}
                type="button"
                onClick={() => onSelectVersion(v.version)}
                className="flex flex-col items-center cursor-pointer group bg-transparent border-none"
              >
                {/* Year Label */}
                <span
                  className={`text-[11px] font-mono mb-2 transition-colors ${
                    isSelected ? "text-[#F8FAFC] font-bold" : "text-[#64748B] group-hover:text-[#94A3B8]"
                  }`}
                >
                  {v.effective_date.split(" ").slice(-1)[0] || "2026"}
                </span>

                {/* Node Pill */}
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border transition-all ${
                    isSelected
                      ? "bg-[#4F46E5] border-[#4F46E5] text-[#F8FAFC] font-bold scale-110 shadow-sm"
                      : isLatest
                      ? "bg-[#0F172A] border-[#10B981] text-[#10B981] group-hover:border-[#10B981]"
                      : "bg-[#0F172A] border-[#334155] text-[#94A3B8] group-hover:border-[#475569]"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span className="text-[10px] font-mono">{idx + 1}</span>
                  )}

                  {isLatest && (
                    <div className="absolute -top-6 px-1.5 py-0.2 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[9px] font-semibold whitespace-nowrap">
                      Current
                    </div>
                  )}
                </div>

                {/* Version Code & Effective Date */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-semibold transition-colors ${
                      isSelected ? "text-[#F8FAFC]" : "text-[#94A3B8] group-hover:text-[#F8FAFC]"
                    }`}
                  >
                    {v.version}
                  </div>
                  <div className="text-[10px] text-[#64748B]">{v.effective_date}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Version Metadata Callout */}
      {(() => {
        const active =
          vList.find((v) => v.version === selectedVersion) ||
          vList[vList.length - 1] || {
            version: "v2.1",
            effective_date: "01 Jul 2026",
            owner: "Priya Sharma",
            owner_role: "VP Strategic Finance",
            formula_display: "((Revenue - Adjusted Cost) / Revenue) × 100",
            change_reason: "Governed semantic definition",
          };
        return (
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#F8FAFC] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                Definition Details: {active.version} (Effective {active.effective_date})
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                Owner: {active.owner} ({active.owner_role})
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#020617] border border-[#334155] font-mono text-[11px] text-[#06B6D4] overflow-x-auto">
              {active.formula_display}
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              <span className="font-semibold text-[#F8FAFC]">Rationale: </span>
              {active.change_reason}
            </p>
          </div>
        );
      })()}
    </div>
  );
};
