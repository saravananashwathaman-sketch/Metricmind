"use client";

import React from "react";
import { ArrowRight, Info, AlertTriangle, ShieldCheck, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { SimulationResult } from "@/types/impact";

interface CurrentVsProposedCardProps {
  simulation: SimulationResult;
}

export const CurrentVsProposedCard: React.FC<CurrentVsProposedCardProps> = ({ simulation }) => {
  const diff = simulation.difference_pp;
  const isZero = diff === 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header with Neutrality Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 6 & 14 • Metric Value Simulation
          </span>
          <h3 className="text-lg font-black text-slate-100 mt-0.5">
            Before vs After Simulation Comparison
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>SIMULATION — NOT ACTUAL DATA</span>
          </span>
        </div>
      </div>

      {/* Tri-Column Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CURRENT */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Current Baseline
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              v{simulation.current_version} Governed
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-100 tracking-tight font-mono">
              {simulation.current_value.toFixed(2)}{simulation.unit}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {simulation.metric_name}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Period: <strong className="text-slate-400">{simulation.scope.period}</strong></span>
            <span>Region: <strong className="text-slate-400">{simulation.scope.region}</strong></span>
          </div>
        </div>

        {/* PROPOSED (SIMULATION) */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-950/30 to-indigo-950/20 border border-sky-500/40 flex flex-col justify-between space-y-3 relative overflow-hidden ring-1 ring-sky-500/20 shadow-lg shadow-sky-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Proposed Value</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold uppercase tracking-wider">
              Simulation Sandbox
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-sky-300 tracking-tight font-mono">
              {simulation.simulated_value.toFixed(2)}{simulation.unit}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {simulation.metric_name} (Simulated)
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Target Version: <strong className="text-sky-300">Draft v2.2</strong></span>
            <span className="text-amber-400 font-bold font-mono text-[10px]">READ ONLY</span>
          </div>
        </div>

        {/* IMPACT (DELTA) - ANALTICALLY NEUTRAL */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Net Impact Difference
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
              Neutral Delta
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-100 tracking-tight font-mono flex items-center gap-2">
              <span>{diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} pp</span>
              <span className="text-sm font-sans text-slate-400 font-normal">
                ({(((simulation.simulated_value - simulation.current_value) / simulation.current_value) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Change in percentage points
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>Downstream Footprint: <strong className="text-slate-200">{simulation.impact_assessment.total_affected_assets} Assets Affected</strong></span>
          </div>
        </div>
      </div>

      {/* Semantic Component Breakdown (Section 14) */}
      <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider">
          <span>Component Math Calculation Breakdown</span>
          <span className="text-slate-500 font-normal">Deterministic Enterprise Sample (Q3 2026 Europe)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-bold block">RECOGNIZED REVENUE</span>
            <span className="text-sm font-mono font-bold text-slate-200">₹48.60 Cr</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-bold block">BASE COGS (COST)</span>
            <span className="text-sm font-mono font-bold text-slate-200">₹35.38 Cr</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-bold block">LOGISTICS FREIGHT</span>
            <span className="text-sm font-mono font-bold text-sky-400">₹2.10 Cr</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-bold block">SIMULATION FORMULA</span>
            <span className="text-[11px] font-mono text-emerald-400 truncate block">
              (48.60 - 35.38 - 2.10) / 48.60 × 100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
