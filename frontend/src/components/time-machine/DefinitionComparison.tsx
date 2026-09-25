"use client";

import React from "react";
import { GitCompare, AlertTriangle, ArrowRight, LayoutDashboard, FileText, BookmarkCheck, TrendingDown } from "lucide-react";

interface DefinitionComparisonProps {
  changeDate?: string;
  previousFormula?: string;
  currentFormula?: string;
  impactPp?: number;
  affectedDashboards?: number;
  affectedReports?: number;
  affectedSavedInsights?: number;
  changeReason?: string;
}

export const DefinitionComparison: React.FC<DefinitionComparisonProps> = ({
  changeDate = "18 Sep 2026",
  previousFormula = "((Revenue - Cost) / Revenue) × 100",
  currentFormula = "((Revenue - Cost - Logistics Cost) / Revenue) × 100",
  impactPp = -1.9,
  affectedDashboards = 14,
  affectedReports = 8,
  affectedSavedInsights = 23,
  changeReason = "Refined cost accounting by including dedicated European freight, line-haul logistics and carrier fuel adjustments into governed COGS."
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            WHAT CHANGED? (Definition History)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Metric Definition Modified: {changeDate}</span>
        </div>
      </div>

      {/* Side-by-side Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Version */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Previous Definition (Pre-Change)
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded">
              v1.0 / v2.0
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            {previousFormula}
          </div>
          <div className="text-[11px] text-slate-400">
            Standard margin without dedicated line-haul fuel surcharges.
          </div>
        </div>

        {/* Current Version */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-slate-950/80 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider flex items-center gap-1">
              Current Ratified Definition
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </span>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-1.5 py-0.2 rounded border border-indigo-500/30 font-bold">
              v2.1
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-indigo-500/30 font-mono text-xs text-sky-300 overflow-x-auto">
            {currentFormula}
          </div>
          <div className="text-[11px] text-indigo-300/90">
            <span className="text-amber-400 font-bold">Added: </span>
            Deducts dedicated EU line-haul logistics and carrier adjustment.
          </div>
        </div>
      </div>

      {/* Impact Metric & Downstream Blast Radius */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Definition Impact */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between">
          <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider">
            Definition Impact
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span className="text-lg font-black text-rose-300 font-mono">
              {impactPp > 0 ? `+${impactPp}` : impactPp} pp
            </span>
          </div>
          <span className="text-[9px] text-rose-400/80 mt-0.5">Under New Formula</span>
        </div>

        {/* Affected Dashboards */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <LayoutDashboard className="w-3 h-3 text-sky-400" />
            Dashboards
          </span>
          <span className="text-lg font-black text-slate-100 font-mono mt-1">
            {affectedDashboards}
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">Updated automatically</span>
        </div>

        {/* Affected Reports */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <FileText className="w-3 h-3 text-indigo-400" />
            Reports
          </span>
          <span className="text-lg font-black text-slate-100 font-mono mt-1">
            {affectedReports}
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">Audit tagged</span>
        </div>

        {/* Affected Saved Insights */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <BookmarkCheck className="w-3 h-3 text-emerald-400" />
            Saved Insights
          </span>
          <span className="text-lg font-black text-slate-100 font-mono mt-1">
            {affectedSavedInsights}
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">Version synchronized</span>
        </div>
      </div>

      {/* Rationale description */}
      <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300">
        <span className="font-semibold text-slate-200">Governance Change Rationale: </span>
        {changeReason}
      </div>
    </div>
  );
};
