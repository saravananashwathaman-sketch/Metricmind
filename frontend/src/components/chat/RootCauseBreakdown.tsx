"use client";

import React from "react";
import { TrendingDown, TrendingUp, AlertCircle, Info, Layers, Globe } from "lucide-react";
import { CostDriver, DimensionalContribution } from "@/types";

interface RootCauseBreakdownProps {
  drivers: CostDriver[];
  regionalBreakdown: DimensionalContribution[];
  unsupportedNotice?: string;
}

export const RootCauseBreakdown: React.FC<RootCauseBreakdownProps> = ({
  drivers,
  regionalBreakdown,
  unsupportedNotice
}) => {
  if (unsupportedNotice || (!drivers.length && !regionalBreakdown.length)) {
    return (
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-200">Secondary Driver Analysis</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {unsupportedNotice ||
              "Detailed driver analysis is unavailable because the required governed cost metrics are not present in the Semantic Layer."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Contributing Cost Drivers */}
      {drivers.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Contributing Cost Drivers
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">OPEX / COGS Drag</span>
          </div>

          <div className="space-y-2">
            {drivers.map((d, i) => {
              const isUnfavorable = String(d.change_pct).startsWith("+") || (typeof d.impact_pp === "number" && d.impact_pp < 0);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isUnfavorable ? "bg-rose-400" : "bg-emerald-400"
                      }`}
                    />
                    <div>
                      <span className="text-slate-200 font-medium block">{d.driver}</span>
                      <span className="text-[10px] text-slate-500">{d.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono font-bold text-xs ${
                        isUnfavorable ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {d.change_pct}
                    </span>
                    <span className="text-slate-400 text-[10px] block font-mono">
                      ({typeof d.impact_pp === "number" ? `${d.impact_pp} pp` : d.impact_pp})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
            Note: Drivers represent correlated associations identified in the semantic breakdown.
          </div>
        </div>
      )}

      {/* Regional Contribution Breakdown */}
      {regionalBreakdown.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Country Contribution
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Weighted Margin Drag</span>
          </div>

          <div className="space-y-2">
            {regionalBreakdown.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-slate-200 font-medium">{r.value_name}</span>
                </div>
                <div className="text-right font-mono">
                  <div className="text-slate-400 text-[11px]">
                    {r.previous_value}% → {r.current_value}%
                  </div>
                  <div className="text-rose-400 font-bold text-xs">
                    {r.weighted_impact_pp > 0 ? `+${r.weighted_impact_pp}` : r.weighted_impact_pp} pp
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
            Weighted by entity transaction volume across the reporting quarter.
          </div>
        </div>
      )}
    </div>
  );
};
