"use client";

import React from "react";
import { LayoutDashboard, FileText, Database, ShieldCheck } from "lucide-react";
import { SimulationResult } from "@/types/impact";

interface CurrentVsProposedCardProps {
  simulation: SimulationResult;
}

export const CurrentVsProposedCard: React.FC<CurrentVsProposedCardProps> = ({ simulation }) => {
  const diff = simulation.difference_pp;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header with Mandatory Enterprise Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#334155]">
        <div>
          <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
            Financial Modeling Engine
          </span>
          <h3 className="text-lg font-bold text-[#F8FAFC] mt-0.5">
            Side-by-Side Metric Definition Comparison
          </h3>
        </div>

        {/* Badges: SANDBOX, READ ONLY, PRODUCTION DATA UNCHANGED */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
            SANDBOX
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#0F172A] text-[#94A3B8] border border-[#334155]">
            READ ONLY
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            PRODUCTION DATA UNCHANGED
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison: CURRENT DEFINITION vs PROPOSED DEFINITION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CURRENT DEFINITION */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              CURRENT DEFINITION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
              v{simulation.current_version} Governed
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#020617] border border-[#334155] font-mono text-xs text-[#F8FAFC]">
            {simulation.current_definition?.formula || "((Revenue - Cost) / Revenue) × 100"}
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-[#94A3B8]">Current Value:</span>
            <span className="text-2xl font-bold font-mono text-[#F8FAFC]">
              {simulation.current_value.toFixed(2)}{simulation.unit}
            </span>
          </div>

          <div className="text-[11px] text-[#64748B] flex items-center justify-between pt-2 border-t border-[#334155]">
            <span>Scope: {simulation.scope.region} ({simulation.scope.period})</span>
            <span className="text-[#10B981] font-semibold">Active Production</span>
          </div>
        </div>

        {/* PROPOSED DEFINITION */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-[#F59E0B]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              PROPOSED DEFINITION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
              SIMULATION (AMBER)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#020617] border border-[#F59E0B]/30 font-mono text-xs text-[#F59E0B]">
            {simulation.proposed_definition?.formula || "((Revenue - Cost - Logistics Cost) / Revenue) × 100"}
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-[#94A3B8]">Simulated Value:</span>
            <span className="text-2xl font-bold font-mono text-[#F59E0B]">
              {simulation.simulated_value.toFixed(2)}{simulation.unit}
            </span>
          </div>

          <div className="text-[11px] text-[#64748B] flex items-center justify-between pt-2 border-t border-[#334155]">
            <span>Net Delta: <strong className={diff >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}>{diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} pp</strong></span>
            <span className="text-[#F59E0B] font-semibold">Pending Governance</span>
          </div>
        </div>
      </div>

      {/* Downstream Impact Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {/* Definition Change */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#64748B]">Definition Change</span>
          <div className="text-xs font-semibold text-[#F8FAFC]">
            {simulation.change_type === "formula_change" ? "Formula Modified" : "Component Logic"}
          </div>
        </div>

        {/* Expected Impact */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#64748B]">Expected Impact</span>
          <div className="text-xs font-bold font-mono text-[#F59E0B]">
            {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} pp
          </div>
        </div>

        {/* Affected Dashboards */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1">
            <LayoutDashboard className="w-3 h-3 text-[#4F46E5]" />
            Dashboards
          </span>
          <div className="text-xs font-bold font-mono text-[#F8FAFC]">
            {simulation.impact_assessment.dashboards_count} Dashboards
          </div>
        </div>

        {/* Affected Reports */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1">
            <FileText className="w-3 h-3 text-[#06B6D4]" />
            Reports
          </span>
          <div className="text-xs font-bold font-mono text-[#F8FAFC]">
            {simulation.impact_assessment.reports_count} Reports
          </div>
        </div>

        {/* Affected Metrics */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1">
            <Database className="w-3 h-3 text-[#8B5CF6]" />
            Metrics
          </span>
          <div className="text-xs font-bold font-mono text-[#F8FAFC]">
            {simulation.dependent_metrics?.length || 4} Dependent
          </div>
        </div>

        {/* Governance Status */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#F59E0B]" />
            Governance
          </span>
          <div className="text-xs font-semibold text-[#F59E0B]">
            Draft Sandbox
          </div>
        </div>
      </div>
    </div>
  );
};
