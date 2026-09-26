"use client";

import React, { useState } from "react";
import { Search, Database, Layers, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";
import { MetricImpactMetadata } from "@/types/impact";
import { IMPACT_METRICS_CATALOG } from "@/lib/impactSimulator";

interface MetricSelectorProps {
  selectedMetricId: string;
  onSelectMetric: (metricId: string) => void;
  onSimulate?: (metricId: string) => void;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  selectedMetricId,
  onSelectMetric,
  onSimulate
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const allMetrics = Object.values(IMPACT_METRICS_CATALOG);

  const filteredMetrics = allMetrics.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.display_name.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.formula.toLowerCase().includes(q)
    );
  });

  const selectedMetric = IMPACT_METRICS_CATALOG[selectedMetricId] || IMPACT_METRICS_CATALOG.gross_margin;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>Select Governed Metric</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose a business metric to inspect its dependency footprint and simulate alterations.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search metric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredMetrics.map((metric) => {
          const isSelected = metric.id === selectedMetricId;
          return (
            <div
              key={metric.id}
              onClick={() => onSelectMetric(metric.id)}
              className={`group relative p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-sky-500/10 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30"
                  : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {metric.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {metric.display_name}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                    metric.status === "Verified"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  v{metric.current_version}
                </span>
              </div>

              <div className="mt-2 text-[11px] font-mono text-slate-400 truncate bg-black/40 px-2 py-1 rounded border border-slate-800/60">
                {metric.formula_display}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  <span className="text-slate-300 font-medium">Used by {metric.dependencies_count} assets</span>
                </span>
                <span className="text-[10px] text-slate-500">{metric.owner.split(" ")[0]}</span>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
