"use client";

import React from "react";
import { LayoutDashboard, Clock, User, Layers, CheckCircle2 } from "lucide-react";
import { AffectedAssetItem } from "@/types/impact";

interface AffectedDashboardsProps {
  dashboards: AffectedAssetItem[];
}

export const AffectedDashboards: React.FC<AffectedDashboardsProps> = ({ dashboards }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 11 • Dashboard Impact
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-sky-400" />
            Affected Dashboards ({dashboards.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dashboards featuring live KPI cards, variance charts, and regional tables drawing from this metric.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((dash) => (
          <div
            key={dash.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{dash.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  {dash.widgets_count} widgets affected
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {dash.impact_reason}
              </p>
            </div>

            {dash.widgets && dash.widgets.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Affected Widgets</span>
                <ul className="space-y-1">
                  {dash.widgets.map((w, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      <span className="truncate">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">{dash.owner}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{dash.last_updated}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
