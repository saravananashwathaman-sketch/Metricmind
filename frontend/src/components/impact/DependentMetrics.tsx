"use client";

import React from "react";
import { Network, ArrowRight, TrendingDown, TrendingUp, ShieldCheck } from "lucide-react";
import { DependentMetricImpact } from "@/types/impact";

interface DependentMetricsProps {
  metrics: DependentMetricImpact[];
}

export const DependentMetrics: React.FC<DependentMetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 10 • Derived Metric Cascades
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" />
            Dependent Derived Metrics ({metrics.length} Affected)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Secondary business metrics that mathematically incorporate this metric in their numerator, denominator, or weighted composite score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((dm, idx) => (
          <div
            key={dm.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-400">#{idx + 1} Cascading Node</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {dm.unit}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{dm.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{dm.impact_path}</p>
            </div>

            {/* Formula comparison */}
            <div className="space-y-1.5 text-[11px] font-mono bg-black/50 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 truncate">
                <span className="text-slate-500 mr-1">Current:</span>
                {dm.current_formula}
              </div>
              <div className="text-purple-300 truncate">
                <span className="text-purple-500 mr-1">Simulated:</span>
                {dm.proposed_formula}
              </div>
            </div>

            {/* Values comparison */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Current</span>
                <span className="text-sm font-bold font-mono text-slate-200">
                  {dm.current_value} {dm.unit}
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />

              <div>
                <span className="text-[10px] text-purple-400 font-bold block uppercase">Simulated</span>
                <span className="text-sm font-bold font-mono text-purple-300">
                  {dm.simulated_value} {dm.unit}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Delta</span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {dm.difference > 0 ? `+${dm.difference}` : dm.difference}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
