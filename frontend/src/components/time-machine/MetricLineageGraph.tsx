"use client";

import React, { useState } from "react";
import { TimeMachineLineageNode, TimeMachineLineageEdge } from "@/types/timeMachine";
import { GitFork, ArrowDown, Database, ShieldCheck, Box, HardDrive, FileCode, CheckCircle2, Info } from "lucide-react";

interface MetricLineageGraphProps {
  nodes?: TimeMachineLineageNode[];
  edges?: TimeMachineLineageEdge[];
}

export const MetricLineageGraph: React.FC<MetricLineageGraphProps> = ({ nodes = [], edges = [] }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("lin_semantic");

  const safeNodes = nodes || [];
  const selectedNode =
    safeNodes.find((n) => n.id === selectedNodeId) ||
    safeNodes[0] || {
      id: "unknown",
      label: "Lineage Node",
      category: "kpi" as const,
      description: "Governed semantic layer trace",
      meta: {},
      status: "verified" as const
    };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "kpi":
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "semantic":
        return <GitFork className="w-4 h-4 text-sky-400" />;
      case "cube":
        return <Box className="w-4 h-4 text-indigo-400" />;
      case "dbt":
        return <FileCode className="w-4 h-4 text-amber-400" />;
      case "table":
        return <Database className="w-4 h-4 text-cyan-400" />;
      case "warehouse":
        return <HardDrive className="w-4 h-4 text-purple-400" />;
      case "snapshot":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <GitFork className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            END-TO-END DATA LINEAGE DAG
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">Click any lineage node to inspect metadata</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Lineage Pipeline (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
          {safeNodes.map((node, index) => {
            const isSelected = node.id === selectedNodeId;
            const hasNext = index < safeNodes.length - 1;


            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                    isSelected
                      ? "bg-slate-900 border-sky-400/80 shadow-lg shadow-sky-500/10 scale-[1.01]"
                      : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg border ${
                        isSelected
                          ? "bg-sky-500/20 border-sky-400/40 text-sky-300"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {getCategoryIcon(node.category)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors block">
                        {node.label}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs sm:max-w-md">
                        {node.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                        node.status === "verified"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : node.status === "immutable"
                          ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>
                </div>

                {/* Connector Arrow */}
                {hasNext && (
                  <div className="flex items-center justify-center py-0.5 text-slate-600">
                    <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Node Inspector Panel (Right 1 col) */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Info className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Node Inspector
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Selected Layer</span>
              <span className="text-sm font-bold text-sky-300 block">{selectedNode.label}</span>
              <span className="text-[11px] text-slate-400 block">{selectedNode.description}</span>
            </div>

            {/* Metadata Properties */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Lineage Metadata:
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Node ID:</span>
                  <span className="text-slate-200">{selectedNode.id}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-indigo-300 uppercase">{selectedNode.category}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Audit Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">{selectedNode.status}</span>
                </div>

                {Object.entries(selectedNode.meta || {}).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">{k}:</span>
                    <span className="text-slate-200">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 mt-3">
            Guaranteed trace to physical database tables without intermediate ad-hoc spreadsheet manipulation.
          </div>
        </div>
      </div>
    </div>
  );
};
