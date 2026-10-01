"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { ExplainNumberButton } from "@/components/time-machine/ExplainNumberButton";
import { PrimaryButton, SecondaryButton } from "@/components/design-system/Buttons";

interface ExecutiveAnalyticsViewProps {
  onAskQuestion: (q: string) => void;
  onExplainNumber?: (metricId: string, period?: string, region?: string, value?: string) => void;
}

export const ExecutiveAnalyticsView: React.FC<ExecutiveAnalyticsViewProps> = ({
  onAskQuestion,
  onExplainNumber,
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
    { name: "Q2 Margin", fullName: "Q2 2026 Margin", value: 27.2, is_total: true },
  ];

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#4F46E5]/15 text-[#818CF8] border border-[#4F46E5]/30">
              Agentic Analysis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#4F46E5]" />
            Executive Analytics Studio
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Multi-dimensional analytical exploration backed by governed semantic layer definitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segment Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8]">
            <Users className="w-3.5 h-3.5 text-[#06B6D4]" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="bg-transparent border-none text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0F172A] text-[#F8FAFC]">All Segments</option>
              <option value="Enterprise" className="bg-[#0F172A] text-[#F8FAFC]">Enterprise Tier</option>
              <option value="Mid-Market" className="bg-[#0F172A] text-[#F8FAFC]">Mid-Market</option>
              <option value="Strategic" className="bg-[#0F172A] text-[#F8FAFC]">Strategic Accounts</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8]">
            <Layers className="w-3.5 h-3.5 text-[#4F46E5]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0F172A] text-[#F8FAFC]">All Categories</option>
              <option value="Cloud" className="bg-[#0F172A] text-[#F8FAFC]">Cloud Infrastructure</option>
              <option value="SaaS" className="bg-[#0F172A] text-[#F8FAFC]">Enterprise SaaS</option>
              <option value="Security" className="bg-[#0F172A] text-[#F8FAFC]">Security Suite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid 1: Margin Driver Waterfall & Regional Profit Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall Variance Bridge */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-[#334155] pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Gross Margin Variance Driver Bridge
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Q1 2026 (31.4%) → Q2 2026 (27.2%) Decomposition
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ExplainNumberButton
                variant="compact"
                metricName="Gross Margin"
                onClick={() => onExplainNumber?.("gross_margin", selectedQuarter, selectedRegion, "27.2%")}
              />
              <button
                type="button"
                onClick={() => onAskQuestion("Why did our European margins drop last quarter?")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F46E5]/15 hover:bg-[#4F46E5]/25 text-[#818CF8] border border-[#4F46E5]/30 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Agent →</span>
              </button>
            </div>
          </div>
          <WaterfallChart data={waterfallData} height="350px" unit="%" />
        </div>

        {/* Regional Performance Comparison Bar */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-[#334155] pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Gross Margin % by Theater (Q1 vs Q2)
              </h3>
              <p className="text-xs text-[#94A3B8]">
                India leading profitability expansion (+3.4 pp)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAskQuestion("Which region has the highest margin?")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F46E5]/15 hover:bg-[#4F46E5]/25 text-[#818CF8] border border-[#4F46E5]/30 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Agent →</span>
            </button>
          </div>
          <ComparisonBarChart
            categories={["Europe", "North America", "India", "APAC"]}
            series={[
              { name: "Q1 2026", data: [31.4, 33.0, 34.8, 31.7], color: "#4F46E5" },
              { name: "Q2 2026", data: [27.2, 34.1, 38.2, 32.5], color: "#06B6D4" },
            ]}
            height="350px"
            unit="%"
          />
        </div>
      </div>

      {/* Grid 2: Revenue Mix & Cost Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown in INR */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Expense Categories (₹ Cr)
            </h3>
            <span className="text-[11px] text-[#64748B]">Q2 2026</span>
          </div>
          <div className="space-y-2.5">
            {[
              { name: "Logistics & Freight", amount: "₹3.24 Cr", change: "+38.4%", drag: "-2.3 pp" },
              { name: "Hardware COGS", amount: "₹5.12 Cr", change: "+24.1%", drag: "-1.4 pp" },
              { name: "Cloud & Datacenter", amount: "₹2.18 Cr", change: "+10.1%", drag: "-0.4 pp" },
              { name: "Field Engineering", amount: "₹1.04 Cr", change: "+5.1%", drag: "-0.1 pp" },
            ].map((exp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F8FAFC]">{exp.name}</span>
                  <span className="text-xs font-mono font-bold text-[#F8FAFC]">{exp.amount}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="text-[#EF4444] font-medium">Surged {exp.change}</span>
                  <span>Impact: {exp.drag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Margins & Revenue */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Product Portfolio Profitability Matrix
            </h3>
            <button
              type="button"
              onClick={() => onAskQuestion("Which products are driving profit?")}
              className="text-xs text-[#4F46E5] hover:text-[#818CF8] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Agent →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0F172A] text-[#94A3B8] uppercase font-semibold text-[10px] tracking-wider border-b border-[#334155]">
                <tr>
                  <th className="px-3.5 py-2.5">Product Name</th>
                  <th className="px-3.5 py-2.5">Category</th>
                  <th className="px-3.5 py-2.5">Q2 Revenue</th>
                  <th className="px-3.5 py-2.5">Gross Margin</th>
                  <th className="px-3.5 py-2.5">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {[
                  { name: "Apex Cloud Core Suite", cat: "Cloud Infrastructure", rev: "₹16.4 Cr", margin: "36.2%", growth: "+18.2%" },
                  { name: "MetricMind Enterprise Analytics", cat: "Enterprise SaaS", rev: "₹14.8 Cr", margin: "47.1%", growth: "+26.5%" },
                  { name: "Sentinels AI Security Guard", cat: "Security Suite", rev: "₹8.2 Cr", margin: "39.1%", growth: "+12.0%" },
                  { name: "EdgeCompute IoT Gateway", cat: "Edge Compute", rev: "₹5.6 Cr", margin: "32.6%", growth: "+4.1%" },
                  { name: "OmniStream Data Fabric", cat: "Data Core", rev: "₹3.6 Cr", margin: "44.1%", growth: "+9.8%" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0F172A]/50 transition-colors">
                    <td className="px-3.5 py-3 text-[#F8FAFC] font-medium">{row.name}</td>
                    <td className="px-3.5 py-3 text-[#94A3B8]">{row.cat}</td>
                    <td className="px-3.5 py-3 font-mono font-bold text-[#F8FAFC]">{row.rev}</td>
                    <td className="px-3.5 py-3 font-mono font-bold text-[#10B981]">{row.margin}</td>
                    <td className="px-3.5 py-3 font-mono font-semibold text-[#06B6D4]">{row.growth}</td>
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
