"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Package,
  Wand2,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { KPICardData, ExecutiveOverviewData } from "@/types";
import { Sparkline } from "@/components/charts/Sparkline";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { PrimaryButton, SecondaryButton } from "@/components/design-system/Buttons";

interface OverviewViewProps {
  data: ExecutiveOverviewData;
  onAskQuestion: (q: string) => void;
  onNavigateTab: (tab: string) => void;
  onExplainNumber?: (metricId: string, period?: string, region?: string, value?: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  data,
  onAskQuestion,
  onNavigateTab,
  onExplainNumber,
}) => {
  const { kpis, regional_distribution, revenue_trend, margin_trend, top_products } = data;

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#4F46E5]/15 text-[#818CF8] border border-[#4F46E5]/30">
              Enterprise Overview
            </span>
            <span className="text-xs font-mono text-[#64748B]">•</span>
            <span className="text-xs font-medium text-[#94A3B8]">{data.period}</span>
            <span className="text-xs font-mono text-[#64748B]">•</span>
            <span className="text-xs font-medium text-[#94A3B8]">{data.region}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            MetricMind
          </h1>
          <p className="text-sm text-[#94A3B8] font-medium">
            Agentic Semantic BI Engine
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <SecondaryButton
            size="sm"
            icon={<Clock className="w-3.5 h-3.5 text-[#06B6D4]" />}
            onClick={() => onExplainNumber?.("gross_margin", data.period, data.region, "27.2%")}
          >
            Explain Gross Margin
          </SecondaryButton>

          <SecondaryButton
            size="sm"
            icon={<Wand2 className="w-3.5 h-3.5 text-[#8B5CF6]" />}
            onClick={() => onNavigateTab("metric-impact")}
          >
            Impact Simulator
          </SecondaryButton>

          <PrimaryButton
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => onAskQuestion("Why did our European margins drop last quarter?")}
          >
            Ask MetricMind
          </PrimaryButton>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Governed Business Metrics
          </span>
          <StatusBadge status="verified" label="100% Governed Integrity" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi: KPICardData) => {
            const isPositive = kpi.change_type === "positive";
            const isNegative = kpi.change_type === "negative";

            return (
              <div
                key={kpi.id}
                className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-[#475569] transition-colors flex flex-col justify-between space-y-4 shadow-sm group"
              >
                {/* Metric Name & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    {kpi.name}
                  </span>
                  <StatusBadge status={kpi.status} size="sm" />
                </div>

                {/* Current Value, Change & Sparkline */}
                <div className="flex items-end justify-between gap-2">
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
                      {kpi.current_value}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
                          isPositive
                            ? "text-[#10B981] bg-[#10B981]/10"
                            : isNegative
                            ? "text-[#EF4444] bg-[#EF4444]/10"
                            : "text-[#94A3B8] bg-[#334155]/60"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : isNegative ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        {kpi.change_pct}
                      </span>
                      <span className="text-[11px] text-[#64748B] truncate">
                        vs previous quarter
                      </span>
                    </div>
                  </div>

                  {kpi.sparkline && (
                    <div className="shrink-0 mb-0.5">
                      <Sparkline
                        data={kpi.sparkline}
                        color={isNegative ? "#EF4444" : "#4F46E5"}
                        height="32px"
                        width="80px"
                      />
                    </div>
                  )}
                </div>

                {/* Card Footer: Governed Formula & Quick Actions */}
                <div className="pt-3 border-t border-[#334155] flex items-center justify-between text-xs text-[#64748B]">
                  <span
                    className="truncate font-mono text-[11px] text-[#94A3B8] max-w-[150px] sm:max-w-[180px]"
                    title={kpi.governed_formula}
                  >
                    {kpi.governed_formula}
                  </span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onExplainNumber?.(kpi.id, data.period, data.region, kpi.current_value)
                      }
                      className="text-[11px] text-[#06B6D4] hover:text-[#38bdf8] font-medium transition-colors cursor-pointer"
                    >
                      Explain
                    </button>
                    <button
                      type="button"
                      onClick={() => onAskQuestion(`Analyze ${kpi.name} performance in detail`)}
                      className="text-[11px] text-[#4F46E5] hover:text-[#818CF8] font-medium transition-colors cursor-pointer"
                    >
                      Analyze →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <div>
              <h2 className="text-sm font-semibold text-[#F8FAFC]">
                Quarterly Revenue by Geography (₹ Cr)
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Top-line revenue trend across enterprise theaters
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#94A3B8] bg-[#0F172A] px-2 py-0.5 rounded border border-[#334155]">
              Q3 25 – Q2 26
            </span>
          </div>

          <TrendLineChart
            periods={revenue_trend.map((r) => r.quarter)}
            series={[
              { name: "Europe", data: revenue_trend.map((r) => r.Europe), color: "#06B6D4" },
              { name: "North America", data: revenue_trend.map((r) => r["North America"]), color: "#4F46E5" },
              { name: "India", data: revenue_trend.map((r) => r.India), color: "#10B981" },
              { name: "APAC", data: revenue_trend.map((r) => r.APAC), color: "#F59E0B" },
            ]}
            height="280px"
            unit=" Cr"
          />
        </div>

        {/* Governed Gross Margin Trend */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <div>
              <h2 className="text-sm font-semibold text-[#F8FAFC]">
                Gross Margin % by Geography
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Tracking European logistics cost drag vs NA and India margins
              </p>
            </div>
            <StatusBadge status="verified" label="Governed Formula" />
          </div>

          <TrendLineChart
            periods={margin_trend.map((r) => r.quarter)}
            series={[
              { name: "Global", data: margin_trend.map((r) => r.Global), color: "#94A3B8" },
              { name: "Europe", data: margin_trend.map((r) => r.Europe), color: "#EF4444" },
              { name: "North America", data: margin_trend.map((r) => r["North America"]), color: "#4F46E5" },
              { name: "India", data: margin_trend.map((r) => r.India), color: "#10B981" },
            ]}
            height="280px"
            unit="%"
          />
        </div>
      </div>

      {/* Regional Performance Matrix & Top Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Breakdown Cards */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h2 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#4F46E5]" />
              <span>Regional Performance</span>
            </h2>
            <span className="text-[11px] text-[#64748B]">Q2 2026</span>
          </div>

          <div className="space-y-2.5">
            {regional_distribution.map((r) => (
              <div
                key={r.region}
                className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-[#475569] transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F8FAFC]">{r.region}</span>
                  <span className="text-xs font-bold text-[#F8FAFC] font-mono">{r.revenue_formatted}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Gross Margin: <strong className="text-[#F8FAFC]">{r.margin}%</strong></span>
                  <span className={r.change.startsWith("-") ? "text-[#EF4444] font-medium" : "text-[#10B981] font-medium"}>
                    {r.change}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-[#334155]">
                  <span>{r.orders} Enterprise Orders</span>
                  <button
                    type="button"
                    onClick={() => onAskQuestion(`Analyze ${r.region} revenue and margin performance`)}
                    className="text-[#06B6D4] hover:underline cursor-pointer"
                  >
                    Drilldown →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Governed Products Suite */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h2 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#06B6D4]" />
              <span>Top Enterprise Product Suites</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab("analytics")}
              className="text-xs text-[#4F46E5] hover:text-[#818CF8] font-medium transition-colors cursor-pointer"
            >
              View Full Analytics →
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
                {top_products.map((p, i) => (
                  <tr key={i} className="hover:bg-[#0F172A]/50 transition-colors">
                    <td className="px-3.5 py-3 text-[#F8FAFC] font-medium">{p.name}</td>
                    <td className="px-3.5 py-3 text-[#94A3B8]">{p.category}</td>
                    <td className="px-3.5 py-3 text-[#F8FAFC] font-mono">{p.revenue}</td>
                    <td className="px-3.5 py-3 text-[#10B981] font-mono font-medium">{p.margin}</td>
                    <td className="px-3.5 py-3 text-[#06B6D4] font-mono">{p.growth}</td>
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
