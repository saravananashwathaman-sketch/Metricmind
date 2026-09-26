"use client";

import React, { useState } from "react";
import {
  GitFork,
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  Search,
  Network,
  Maximize2,
  Minimize2,
  Info,
  ChevronRight,
  Layers,
  X
} from "lucide-react";
import { SimulationResult } from "@/types/impact";

interface DependencyGraphProps {
  simulation: SimulationResult;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({ simulation }) => {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    title: string;
    type: string;
    category: string;
    details: string;
    impact: string;
    severity?: string;
  } | null>(null);

  // Group assets for structured interactive multi-tier lineage visualization
  const dashboards = simulation.affected_assets.filter((a) => a.type === "dashboard");
  const reports = simulation.affected_assets.filter((a) => a.type === "report");
  const insights = simulation.affected_assets.filter((a) => a.type === "saved_insight");
  const dependentMetrics = simulation.dependent_metrics;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 7 & 32 • Interactive Dependency Graph
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-sky-400" />
            Downstream Lineage & Dependency Tree
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any downstream node to inspect its owner, affected widgets, and calculation impact reason.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/20">
            17 Primary Downstream Assets
          </span>
        </div>
      </div>

      {/* Interactive Visual Graph Canvas */}
      <div className="relative rounded-2xl bg-black/60 border border-slate-800/80 p-6 overflow-x-auto min-h-[440px] flex flex-col justify-center">
        {/* Tier Grid Structure */}
        <div className="flex items-center justify-between min-w-[760px] gap-8">
          {/* TIER 0: GOVERNED METRIC (Origin) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase mb-3">Origin Metric</span>
            <div
              onClick={() =>
                setSelectedNode({
                  id: "root",
                  title: simulation.metric_name,
                  type: "Governed Semantic Metric",
                  category: "Origin",
                  details: `Active Version: v${simulation.current_version} • Formula: ${simulation.current_definition.formula}`,
                  impact: "Source of proposed alteration",
                  severity: "high"
                })
              }
              className="p-4 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 border border-sky-400/50 shadow-lg shadow-sky-500/25 text-white cursor-pointer hover:scale-105 transition-transform w-52 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
                Governed Core
              </span>
              <h4 className="text-sm font-black mt-1">{simulation.metric_name}</h4>
              <div className="mt-2 text-[10px] font-mono bg-black/40 px-2 py-1 rounded border border-white/20 truncate">
                {simulation.current_value.toFixed(1)}% → {simulation.simulated_value.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* SVG Connector Lines from Root to Tier 1 */}
          <div className="flex flex-col justify-around py-4 text-slate-600">
            <div className="w-8 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500/40" />
          </div>

          {/* TIER 1: DASHBOARDS & DEPENDENT METRICS */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase text-center mb-1">
              Downstream Hubs (5 Dashboards, 3 Metrics)
            </span>

            {/* Dashboards */}
            <div className="space-y-2">
              {dashboards.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  onClick={() =>
                    setSelectedNode({
                      id: d.id,
                      title: d.name,
                      type: "Executive Dashboard",
                      category: "Dashboard",
                      details: `Owner: ${d.owner} • ${d.widgets_count} widgets affected: ${d.widgets?.join(", ")}`,
                      impact: d.impact_reason,
                      severity: d.severity
                    })
                  }
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850 cursor-pointer transition-all w-60 shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-400 flex items-center gap-1">
                      <LayoutDashboard className="w-3 h-3" />
                      Dashboard
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-300">
                      {d.widgets_count} widgets
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 mt-1 group-hover:text-sky-300 transition-colors">
                    {d.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{d.impact_reason}</p>
                </div>
              ))}
            </div>

            {/* Dependent Metrics */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {dependentMetrics.slice(0, 2).map((dm) => (
                <div
                  key={dm.id}
                  onClick={() =>
                    setSelectedNode({
                      id: dm.id,
                      title: dm.name,
                      type: "Dependent Semantic Metric",
                      category: "Cascading Metric",
                      details: `Formula: ${dm.current_formula} • Projected: ${dm.simulated_value} ${dm.unit}`,
                      impact: dm.impact_path,
                      severity: "high"
                    })
                  }
                  className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/30 cursor-pointer transition-all w-60 shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      Cascading Metric
                    </span>
                    <span className="text-[10px] font-mono font-bold text-purple-300">
                      {dm.difference > 0 ? `+${dm.difference}` : dm.difference}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 mt-1 group-hover:text-purple-300 transition-colors">
                    {dm.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{dm.impact_path}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Connector Lines from Tier 1 to Tier 2 */}
          <div className="flex flex-col justify-around py-4 text-slate-600">
            <div className="w-8 h-0.5 bg-gradient-to-r from-sky-500/40 to-indigo-500/40" />
          </div>

          {/* TIER 2: REPORTS & SAVED INSIGHTS */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase text-center mb-1">
              Disclosures & Findings
            </span>

            {/* Reports */}
            <div className="space-y-2">
              {reports.slice(0, 2).map((r) => (
                <div
                  key={r.id}
                  onClick={() =>
                    setSelectedNode({
                      id: r.id,
                      title: r.name,
                      type: "Executive Report",
                      category: "Report",
                      details: `Owner: ${r.owner} • Affected Sections: ${r.sections?.join(", ")}`,
                      impact: r.impact_reason,
                      severity: r.severity
                    })
                  }
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 cursor-pointer transition-all w-60 shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Report Pack
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300">
                      {r.sections?.length || 2} sections
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 mt-1 group-hover:text-indigo-300 transition-colors">
                    {r.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{r.impact_reason}</p>
                </div>
              ))}
            </div>

            {/* Saved Insights */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {insights.slice(0, 2).map((ins) => (
                <div
                  key={ins.id}
                  onClick={() =>
                    setSelectedNode({
                      id: ins.id,
                      title: ins.name,
                      type: "Saved Agentic Insight",
                      category: "Insight",
                      details: `Owner: ${ins.owner} • Last Updated: ${ins.last_updated}`,
                      impact: ins.impact_reason,
                      severity: ins.severity
                    })
                  }
                  className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/30 cursor-pointer transition-all w-60 shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <BookmarkCheck className="w-3 h-3" />
                      Saved Insight
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono">Pinned</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 mt-1 group-hover:text-emerald-300 transition-colors">
                    {ins.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{ins.impact_reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-sky-500/40 text-xs space-y-2 relative animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">
                {selectedNode.type}
              </span>
              <h4 className="text-sm font-bold text-slate-100">{selectedNode.title}</h4>
            </div>
            <p className="text-slate-300 text-xs">{selectedNode.impact}</p>
            <div className="text-[11px] text-slate-400 font-mono bg-black/40 p-2 rounded border border-slate-800/80">
              {selectedNode.details}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
