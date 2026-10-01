"use client";

import React from "react";
import { GitCompare, LayoutDashboard, FileText, BookmarkCheck, Database } from "lucide-react";

interface DefinitionComparisonProps {
  changeDate?: string;
  previousFormula?: string;
  currentFormula?: string;
  impactPp?: number;
  affectedDashboards?: number;
  affectedReports?: number;
  affectedSavedInsights?: number;
  affectedDependentMetrics?: number;
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
  affectedDependentMetrics = 4,
  changeReason = "Refined cost accounting by including dedicated European freight, line-haul logistics and carrier fuel adjustments into governed COGS.",
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-[#4F46E5]" />
          <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
            What Changed? (Definition History)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#F59E0B] bg-[#0F172A] px-2.5 py-0.5 rounded border border-[#334155]">
          <span>Modified: {changeDate}</span>
        </div>
      </div>

      {/* Side-by-side Visual Comparison: Previous Definition vs Current Definition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Version */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
              Previous Definition (Pre-Change)
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8] bg-[#1E293B] px-1.5 py-0.2 rounded border border-[#334155]">
              v1.0 / v2.0
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#020617] border border-[#334155] font-mono text-xs text-[#94A3B8] overflow-x-auto">
            {previousFormula}
          </div>
          <div className="text-[11px] text-[#64748B]">
            Standard margin without dedicated line-haul fuel surcharges.
          </div>
        </div>

        {/* Current Version */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#4F46E5]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#818CF8] tracking-wider flex items-center gap-1">
              Current Ratified Definition
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
            </span>
            <span className="text-[10px] font-mono text-[#818CF8] bg-[#4F46E5]/15 px-1.5 py-0.2 rounded border border-[#4F46E5]/30 font-semibold">
              v2.1
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#020617] border border-[#4F46E5]/30 font-mono text-xs text-[#06B6D4] overflow-x-auto">
            {currentFormula}
          </div>
          <div className="text-[11px] text-[#94A3B8]">
            <span className="text-[#F59E0B] font-semibold">Added: </span>
            Deducts dedicated EU line-haul logistics and carrier adjustment.
          </div>
        </div>
      </div>

      {/* Impact Footprint: Dashboards, Reports, Saved Insights, Dependent Metrics */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
          Downstream Impact
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Affected Dashboards */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between space-y-1">
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider flex items-center gap-1">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#4F46E5]" />
              Dashboards
            </span>
            <span className="text-xl font-bold text-[#F8FAFC] font-mono">
              {affectedDashboards}
            </span>
            <span className="text-[10px] text-[#64748B]">Updated automatically</span>
          </div>

          {/* Affected Reports */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between space-y-1">
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#06B6D4]" />
              Reports
            </span>
            <span className="text-xl font-bold text-[#F8FAFC] font-mono">
              {affectedReports}
            </span>
            <span className="text-[10px] text-[#64748B]">Audit tagged</span>
          </div>

          {/* Affected Saved Insights */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between space-y-1">
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Saved Insights
            </span>
            <span className="text-xl font-bold text-[#F8FAFC] font-mono">
              {affectedSavedInsights}
            </span>
            <span className="text-[10px] text-[#64748B]">Version synchronized</span>
          </div>

          {/* Affected Dependent Metrics */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between space-y-1">
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Dependent Metrics
            </span>
            <span className="text-xl font-bold text-[#F8FAFC] font-mono">
              {affectedDependentMetrics}
            </span>
            <span className="text-[10px] text-[#64748B]">Lineage evaluated</span>
          </div>
        </div>
      </div>

      {/* Rationale description */}
      <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8]">
        <span className="font-semibold text-[#F8FAFC]">Governance Change Rationale: </span>
        {changeReason}
      </div>
    </div>
  );
};
