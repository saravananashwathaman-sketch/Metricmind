"use client";

import React, { useState, useEffect } from "react";
import {
  GitFork,
  Database,
  Layers,
  Sparkles,
  Server,
  Table,
  CheckCircle2,
  ShieldCheck,
  ArrowDown,
  Info,
  ExternalLink
} from "lucide-react";
import { LineageGraphData, LineageNode } from "@/types";
import { api } from "@/lib/api";
import { DEFAULT_LINEAGE_DATA } from "@/lib/mockData";

interface DataLineageViewProps {
  initialMetricId?: string;
  onAskQuestion: (q: string) => void;
}

export const DataLineageView: React.FC<DataLineageViewProps> = ({
  initialMetricId = "gross_margin",
  onAskQuestion
}) => {
  const [lineageData, setLineageData] = useState<LineageGraphData>(DEFAULT_LINEAGE_DATA);
  const [selectedNode, setSelectedNode] = useState<LineageNode>(DEFAULT_LINEAGE_DATA.nodes[1]); // Governed Metric node
  const [metricId, setMetricId] = useState(initialMetricId);

  useEffect(() => {
    loadLineage(metricId);
  }, [metricId]);

  const loadLineage = async (mId: string) => {
    const data = await api.getLineage(mId);
    setLineageData(data);
    if (data.nodes.length > 1) setSelectedNode(data.nodes[1]);
  };

  const getNodeIcon = (type: LineageNode["type"]) => {
    switch (type) {
      case "question":
        return <Sparkles className="w-5 h-5 text-sky-400" />;
      case "metric":
        return <Layers className="w-5 h-5 text-indigo-400" />;
      case "semantic":
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case "dbt":
        return <GitFork className="w-5 h-5 text-amber-400" />;
      case "table":
        return <Table className="w-5 h-5 text-purple-400" />;
      case "warehouse":
        return <Server className="w-5 h-5 text-cyan-400" />;
      default:
        return <Database className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <GitFork className="w-6 h-6 text-indigo-400" />
            End-to-End Governed Data Lineage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete cryptographic audit trail: Natural Language Question → Semantic Layer → dbt Models → Snowflake DW.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500">Metric Lineage:</span>
            <select
              value={metricId}
              onChange={(e) => setMetricId(e.target.value)}
              className="bg-transparent border-none text-xs text-sky-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="gross_margin">Gross Margin %</option>
              <option value="revenue">Gross Revenue</option>
              <option value="churn_rate">Customer Churn Rate</option>
              <option value="net_profit">Net Profit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main DAG Graph + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive DAG Flow Diagram */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Lineage DAG Flow (Click any layer to inspect)
            </div>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {lineageData.governed_compliance}
            </span>
          </div>

          {/* DAG Nodes Column Flow */}
          <div className="space-y-3 py-2">
            {lineageData.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const edge = lineageData.edges[index];

              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                      isSelected
                        ? "bg-slate-900 border-sky-500 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/30 scale-[1.01]"
                        : "bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                        {getNodeIcon(node.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Layer {index + 1}: {node.layer}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {node.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 truncate mt-0.5">
                          {node.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                          {node.detail}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-500 group-hover:text-sky-400 transition-colors">
                      <Info className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Connecting Edge Indicator */}
                  {index < lineageData.nodes.length - 1 && (
                    <div className="flex items-center justify-center py-0.5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono bg-slate-950 px-3 py-1 rounded-full border border-slate-800/80">
                        <ArrowDown className="w-3 h-3 text-sky-400" />
                        <span>{edge?.label || "Transforms To"}</span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Layer Inspector Drawer */}
        <div className="lg:col-span-4">
          {selectedNode ? (
            <div className="sticky top-20 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {getNodeIcon(selectedNode.type)}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {selectedNode.layer}
                    </span>
                    <h3 className="text-base font-black text-slate-100">
                      {selectedNode.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Layer Role</span>
                  <p className="text-slate-300 leading-relaxed">
                    {lineageData.layer_descriptions[selectedNode.layer] || "Enterprise governance layer ensuring single source of truth."}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Layer Configuration</span>
                  <code className="block text-[11px] font-mono text-sky-300 overflow-x-auto">
                    {selectedNode.detail}
                  </code>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Integrity Status</span>
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Synchronized & Passing Assertions</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => onAskQuestion("Why did our European margins drop last quarter?")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20"
                >
                  Ask Question on this Metric →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-xs">
              Select any DAG layer to inspect governance parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
