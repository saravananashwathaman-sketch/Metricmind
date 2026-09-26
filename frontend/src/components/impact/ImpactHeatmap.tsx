"use client";

import React from "react";
import { Grid, Eye, AlertCircle } from "lucide-react";
import { SimulationResult } from "@/types/impact";

interface ImpactHeatmapProps {
  simulation: SimulationResult;
}

export const ImpactHeatmap: React.FC<ImpactHeatmapProps> = ({ simulation }) => {
  const rows = [
    {
      category: "Executive Dashboards",
      current: "5 active",
      affected: "5 affected",
      simulated: "4 tiles updated",
      intensity: "high",
      note: "Primary KPI card & regional performance widgets modified"
    },
    {
      category: "Management Reports",
      current: "8 published",
      affected: "8 affected",
      simulated: "14 sections refreshed",
      intensity: "high",
      note: "Quarterly Board deck & European margin memos impacted"
    },
    {
      category: "Saved Queries",
      current: "42 registered",
      affected: "42 impacted",
      simulated: "Re-execution scheduled",
      intensity: "medium",
      note: "Automated business queries drawing from fct_sales mart"
    },
    {
      category: "Saved Insights",
      current: "14 pinned",
      affected: "14 referenced",
      simulated: "Historical baseline preserved",
      intensity: "medium",
      note: "Historical driver waterfall insights flagged with definition shift"
    },
    {
      category: "Dependent Metrics",
      current: "3 governed",
      affected: "3 cascading",
      simulated: "Values recalculated",
      intensity: "high",
      note: "Profitability Index, Regional Efficiency, Exec Scorecard"
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 33 • Impact Heatmap Matrix
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Grid className="w-5 h-5 text-sky-400" />
            Downstream Ecosystem Sensitivity Heatmap
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/80" />
            <span>High Intensity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/80" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/80" />
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Asset Class</th>
              <th className="py-3 px-4">Current Footprint</th>
              <th className="py-3 px-4">Affected Assets</th>
              <th className="py-3 px-4">Simulated State</th>
              <th className="py-3 px-4">Operational Impact Memo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-200 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      row.intensity === "high"
                        ? "bg-rose-500 shadow-sm shadow-rose-500"
                        : "bg-amber-400 shadow-sm shadow-amber-400"
                    }`}
                  />
                  <span>{row.category}</span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{row.current}</td>
                <td className="py-3 px-4 font-mono font-bold text-rose-300 bg-rose-500/5">
                  {row.affected}
                </td>
                <td className="py-3 px-4 font-mono text-sky-300">{row.simulated}</td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
