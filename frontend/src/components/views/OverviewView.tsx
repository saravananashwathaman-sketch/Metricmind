"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Package,
  Layers,
  Activity
} from "lucide-react";
import { ExecutiveOverviewData, KPICardData } from "@/types";
import { Sparkline } from "@/components/charts/Sparkline";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";

interface OverviewViewProps {
  data: ExecutiveOverviewData;
  onAskQuestion: (q: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  data,
  onAskQuestion,
  onNavigateTab
}) => {
  const { greeting, subtitle, kpis, regional_distribution, revenue_trend, margin_trend, top_products } = data;

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Executive Welcome Hero Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Governed Enterprise BI • {data.period}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {subtitle}
            </p>
          </div>

          <button
            onClick={() => onAskQuestion("Why did our European margins drop last quarter?")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-xl shadow-sky-500/25 shrink-0 group"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask &quot;Why did European margins drop?&quot;</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 6 Governed Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi: KPICardData) => {
          const isPositive = kpi.change_type === "positive";
          const isNegative = kpi.change_type === "negative";

          return (
            <div
              key={kpi.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-lg backdrop-blur-xl flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {kpi.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  {kpi.status}
                </span>
              </div>

              <div className="flex items-end justify-between gap-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                    {kpi.current_value}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.2 rounded-full ${
                        isPositive
                          ? "bg-emerald-500/15 text-emerald-400"
                          : isNegative
                          ? "bg-rose-500/15 text-rose-400"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : isNegative ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      {kpi.change_pct}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">{kpi.subtext}</span>
                  </div>
                </div>

                {/* Sparkline chart */}
                <Sparkline
                  data={kpi.sparkline}
                  color={isNegative ? "#f43f5e" : "#38bdf8"}
                  height="34px"
                  width="85px"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate font-mono">{kpi.governed_formula}</span>
                <button
                  onClick={() => onAskQuestion(`Analyze ${kpi.name} performance in detail`)}
                  className="text-sky-400 hover:text-sky-300 font-semibold shrink-0 ml-2"
                >
                  Analyze →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Expansion Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Quarterly Revenue by Geography (₹ Cr)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Multi-period top-line recognized expansion across enterprise theaters
              </p>
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              Q3 25 – Q2 26
            </span>
          </div>

          <TrendLineChart
            periods={revenue_trend.map((r) => r.quarter)}
            series={[
              { name: "Europe", data: revenue_trend.map((r) => r.Europe), color: "#38bdf8" },
              { name: "North America", data: revenue_trend.map((r) => r["North America"]), color: "#818cf8" },
              { name: "India", data: revenue_trend.map((r) => r.India), color: "#34d399" },
              { name: "APAC", data: revenue_trend.map((r) => r.APAC), color: "#fbbf24" }
            ]}
            height="290px"
            unit=" Cr"
          />
        </div>

        {/* Governed Gross Margin Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Gross Margin % by Geography
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Spotting European logistics margin drag vs India & NA resilience
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Governed Formula
            </span>
          </div>

          <TrendLineChart
            periods={margin_trend.map((r) => r.quarter)}
            series={[
              { name: "Global", data: margin_trend.map((r) => r.Global), color: "#e2e8f0" },
              { name: "Europe", data: margin_trend.map((r) => r.Europe), color: "#f43f5e" },
              { name: "North America", data: margin_trend.map((r) => r["North America"]), color: "#818cf8" },
              { name: "India", data: margin_trend.map((r) => r.India), color: "#34d399" }
            ]}
            height="290px"
            unit="%"
          />
        </div>
      </div>

      {/* Regional Performance Matrix & Top Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Breakdown Cards */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              Regional Performance
            </h3>
            <span className="text-[10px] text-slate-500">Q2 2026</span>
          </div>

          <div className="space-y-2.5">
            {regional_distribution.map((r) => (
              <div
                key={r.region}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{r.region}</span>
                  <span className="text-xs font-black text-slate-100">{r.revenue_formatted}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Gross Margin: <strong className="text-slate-200">{r.margin}%</strong></span>
                  <span className={r.change.startsWith("-") ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                    {r.change}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
                  <span>{r.orders} Enterprise Orders</span>
                  <button
                    onClick={() => onAskQuestion(`Analyze ${r.region} revenue and margin performance`)}
                    className="text-sky-400 hover:underline"
                  >
                    Drilldown →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Governed Products Suite */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-400" />
              Top Enterprise Product Suites
            </h3>
            <button
              onClick={() => onNavigateTab("analytics")}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
            >
              View Full Analytics →
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
                {top_products.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-950/40 transition-colors">
                    <td className="px-3 py-2.5 text-slate-100 font-semibold">{p.name}</td>
                    <td className="px-3 py-2.5 text-slate-400">{p.category}</td>
                    <td className="px-3 py-2.5 text-slate-200 font-mono font-bold">{p.revenue}</td>
                    <td className="px-3 py-2.5 text-emerald-400 font-mono font-bold">{p.margin}</td>
                    <td className="px-3 py-2.5 text-sky-400 font-mono font-semibold">{p.growth}</td>
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
