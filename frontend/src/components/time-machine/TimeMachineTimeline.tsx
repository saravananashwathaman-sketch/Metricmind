"use client";

import React from "react";
import { MetricVersion } from "@/types/timeMachine";
import { Calendar, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

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
  currentPeriodLabel = "Q3 2026"
}) => {
  const vList = versions || [];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Metric Version Timeline
          </h3>
          <span className="text-[10px] text-slate-400">
            (Travel through historical governed logic)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active: {selectedVersion}</span>
        </div>
      </div>

      {/* Visual Timeline Track */}
      <div className="relative pt-6 pb-4 px-4 sm:px-8">
        {/* Horizontal Track Bar */}
        <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-slate-800 rounded-full" />
        <div
          className="absolute top-1/2 left-8 h-1 -translate-y-1/2 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(
              20,
              ((vList.findIndex((v) => v.version === selectedVersion) + 1) / Math.max(1, vList.length)) * 100 - 15
            )}%`
          }}
        />

        {/* Timeline Milestones */}
        <div className="relative flex justify-between items-center">
          {vList.map((v, idx) => {
            const isSelected = v.version === selectedVersion;
            const isLatest = idx === vList.length - 1;


            return (
              <div
                key={v.version}
                onClick={() => onSelectVersion(v.version)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Year Label */}
                <span
                  className={`text-[10px] font-mono mb-2 transition-colors ${
                    isSelected ? "text-sky-300 font-bold" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {v.effective_date.split(" ").slice(-1)[0] || "2026"}
                </span>

                {/* Node Pill */}
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    isSelected
                      ? "bg-sky-500 border-sky-300 text-slate-950 font-bold scale-125 shadow-lg shadow-sky-500/40"
                      : isLatest
                      ? "bg-slate-900 border-emerald-400 text-emerald-300 group-hover:border-emerald-300"
                      : "bg-slate-900 border-slate-700 text-slate-400 group-hover:border-slate-500 group-hover:scale-105"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 fill-slate-950 text-white" />
                  ) : (
                    <span className="text-[10px] font-mono">{idx + 1}</span>
                  )}

                  {/* "Current Value" Pin indicator on latest node */}
                  {isLatest && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold whitespace-nowrap shadow-sm">
                      Current Value
                    </div>
                  )}
                </div>

                {/* Version Code & Effective Date */}
                <div className="mt-2.5 text-center">
                  <div
                    className={`text-xs font-bold transition-colors ${
                      isSelected ? "text-sky-300" : "text-slate-300 group-hover:text-slate-100"
                    }`}
                  >
                    {v.version}
                  </div>
                  <div className="text-[10px] text-slate-400">{v.effective_date}</div>
                  <span
                    className={`inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      v.status === "Verified"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>
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
            change_reason: "Governed semantic definition"
          };
        return (

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Definition Details: {active.version} (Effective {active.effective_date})
              </span>
              <span className="text-[10px] text-slate-400">Owner: {active.owner} ({active.owner_role})</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto">
              {active.formula_display}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Rationale: </span>
              {active.change_reason}
            </p>
          </div>
        );
      })()}
    </div>
  );
};
