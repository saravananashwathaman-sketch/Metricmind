"use client";

import React from "react";
import { MetricDependencyNode } from "@/types/timeMachine";
import { Network, ArrowDown, ArrowUp, ArrowRight, Layers, Sparkles } from "lucide-react";

interface MetricDependencyGraphProps {
  dependencyGraph?: MetricDependencyNode[];
}

export const MetricDependencyGraph: React.FC<MetricDependencyGraphProps> = ({ dependencyGraph = [] }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            METRIC DEPENDENCY GRAPH
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">Hierarchical calculation dependencies</span>
      </div>

      {/* Visual Tree Visualization */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center space-y-6">
        {/* Level 1: Primary Inputs (Revenue & Cost) */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 w-full max-w-xl">
          {/* Revenue Node */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-500/30 text-center min-w-[140px] shadow-md">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">Input 1</span>
            <span className="text-sm font-bold text-slate-100 block mt-0.5">Revenue</span>
            <span className="text-base font-black text-sky-300 font-mono block mt-1">₹48.60 Cr</span>
            <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">SUM(billings)</span>
          </div>

          {/* Plus/Minus Indicator */}
          <div className="text-slate-500 font-bold text-sm hidden sm:block">vs</div>

          {/* Cost Node */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 text-center min-w-[140px] shadow-md">
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">Input 2</span>
            <span className="text-sm font-bold text-slate-100 block mt-0.5">Cost (COGS)</span>
            <span className="text-base font-black text-rose-300 font-mono block mt-1">₹35.38 Cr</span>
            <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">Materials + Freight</span>
          </div>
        </div>

        {/* Connective Arrows down to Gross Margin */}
        <div className="flex items-center justify-center gap-16 text-slate-600">
          <ArrowDown className="w-5 h-5 text-sky-500/60 animate-bounce" />
          <ArrowDown className="w-5 h-5 text-rose-500/60 animate-bounce" />
        </div>

        {/* Level 2: Target Metric (Gross Margin) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-indigo-950/50 to-emerald-950/60 border-2 border-sky-400 shadow-xl shadow-sky-500/10 text-center min-w-[220px]">
          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Target Governed Metric</span>
          </div>
          <h4 className="text-lg font-black text-slate-100 tracking-tight mt-0.5">
            Gross Margin
          </h4>
          <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
            27.20%
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            (Revenue - Cost) / Revenue × 100
          </span>
        </div>

        {/* Connective Arrow down to Cost Decomposition */}
        <div className="text-slate-600 flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 mb-1">
            Decomposes Direct Cost Dependencies
          </span>
          <ArrowDown className="w-4 h-4 text-slate-500" />
        </div>

        {/* Level 3: Cost Subcomponents */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Raw Materials</span>
            <span className="text-sm font-bold text-slate-200 font-mono block mt-0.5">₹18.50 Cr</span>
            <span className="text-[10px] text-slate-500 block">52.3% of Cost</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider block">Logistics & Freight</span>
            <span className="text-sm font-bold text-amber-300 font-mono block mt-0.5">₹10.42 Cr</span>
            <span className="text-[10px] text-slate-500 block">29.4% of Cost</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Operations & Cloud</span>
            <span className="text-sm font-bold text-slate-200 font-mono block mt-0.5">₹6.46 Cr</span>
            <span className="text-[10px] text-slate-500 block">18.3% of Cost</span>
          </div>
        </div>
      </div>
    </div>
  );
};
