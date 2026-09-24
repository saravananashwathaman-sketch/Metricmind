"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  Building,
  Users,
  Activity
} from "lucide-react";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { WaterfallChart } from "@/components/charts/WaterfallChart";

interface ExecutiveAnalyticsViewProps {
  onAskQuestion: (q: string) => void;
}

export const ExecutiveAnalyticsView: React.FC<ExecutiveAnalyticsViewProps> = ({
  onAskQuestion
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState("Q2 2026");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedSegment, setSelectedSegment] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const waterfallData = [
    { name: "Q1 Margin", fullName: "Q1 2026 Margin", value: 31.4, is_total: true },
    { name: "Logistics", fullName: "Logistics", value: -2.3 },
    { name: "Raw Materials", fullName: "Raw Materials", value: -1.4 },
    { name: "COGS", fullName: "COGS", value: -0.4 },
    { name: "Cloud Bandwidth", fullName: "Cloud Bandwidth", value: -0.4 },
    { name: "Field Ops Drag", fullName: "Field Ops Drag", value: -0.1 },
    { name: "Q2 Margin", fullName: "Q2 2026 Margin", value: 27.2, is_total: true }
  ];

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-sky-400" />
            Executive Analytics Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive multi-dimensional exploration backed by governed semantic definitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segment Filter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Segments</option>
              <option value="Enterprise">Enterprise Tier</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="Strategic">Strategic Accounts</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Cloud">Cloud Infrastructure</option>
              <option value="SaaS">Enterprise SaaS</option>
              <option value="Security">Security Suite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid 1: Margin Driver Waterfall & Regional Profit Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall Variance Bridge */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Gross Margin Variance Driver Bridge
              </h3>
              <p className="text-[11px] text-slate-400">
                Q1 2026 (31.4%) → Q2 2026 (27.2%) Decomposition
              </p>
            </div>
            <button
              onClick={() => onAskQuestion("Why did our European margins drop last quarter?")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/20 text-xs font-semibold shrink-0 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Agent →</span>
            </button>
          </div>
          <WaterfallChart data={waterfallData} height="350px" unit="%" />
        </div>

        {/* Regional Performance Comparison Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Gross Margin % by Theater (Q1 vs Q2)
              </h3>
              <p className="text-[11px] text-slate-400">
                India leading profitability expansion (+3.4 pp)
              </p>
            </div>
            <button
              onClick={() => onAskQuestion("Which region has the highest margin?")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/20 text-xs font-semibold shrink-0 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Agent →</span>
            </button>
          </div>
          <ComparisonBarChart
            categories={["Europe", "North America", "India", "APAC"]}
            series={[
              { name: "Q1 2026", data: [31.4, 33.0, 34.8, 31.7] },
              { name: "Q2 2026", data: [27.2, 34.1, 38.2, 32.5] }
            ]}
            height="350px"
            unit="%"
          />
        </div>
      </div>

      {/* Grid 2: Revenue Mix & Cost Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown in INR */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Expense Categories (₹ Cr)
            </h3>
            <span className="text-[10px] text-slate-500">Q2 2026</span>
          </div>
          <div className="space-y-3">
            {[
              { name: "Logistics & Freight", amount: "₹3.24 Cr", change: "+38.4%", drag: "-2.3 pp", color: "bg-rose-500" },
              { name: "Hardware COGS", amount: "₹5.12 Cr", change: "+24.1%", drag: "-1.4 pp", color: "bg-amber-500" },
              { name: "Cloud & Datacenter", amount: "₹2.18 Cr", change: "+10.1%", drag: "-0.4 pp", color: "bg-sky-500" },
              { name: "Field Engineering", amount: "₹1.04 Cr", change: "+5.1%", drag: "-0.1 pp", color: "bg-emerald-500" }
            ].map((exp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{exp.name}</span>
                  <span className="text-xs font-mono font-bold text-slate-100">{exp.amount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-rose-400 font-medium">Surged {exp.change}</span>
                  <span className="text-slate-400">Margin Impact: {exp.drag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Margins & Revenue */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Product Portfolio Profitability Matrix
            </h3>
            <button
              onClick={() => onAskQuestion("Which products are driving profit?")}
              className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Agent →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="px-3 py-2">Product Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Q2 Revenue (₹)</th>
                  <th className="px-3 py-2">Gross Margin</th>
                  <th className="px-3 py-2">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { name: "Apex Cloud Core Suite", cat: "Cloud Infrastructure", rev: "₹16.4 Cr", margin: "36.2%", growth: "+18.2%" },
                  { name: "MetricMind Enterprise Analytics", cat: "Enterprise SaaS", rev: "₹14.8 Cr", margin: "47.1%", growth: "+26.5%" },
                  { name: "Sentinels AI Security Guard", cat: "Security Suite", rev: "₹8.2 Cr", margin: "39.1%", growth: "+12.0%" },
                  { name: "EdgeCompute IoT Gateway", cat: "Edge Compute", rev: "₹5.6 Cr", margin: "32.6%", growth: "+4.1%" },
                  { name: "OmniStream Data Fabric", cat: "Data Core", rev: "₹3.6 Cr", margin: "44.1%", growth: "+9.8%" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="px-3 py-2.5 text-slate-200 font-semibold">{row.name}</td>
                    <td className="px-3 py-2.5 text-slate-400">{row.cat}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-slate-100">{row.rev}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-emerald-400">{row.margin}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-sky-400">{row.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
