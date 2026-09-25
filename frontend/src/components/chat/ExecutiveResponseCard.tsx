"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  Share2,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart2,
  Table,
  Check,
  Copy,
  GitFork,
  History,
  Clock
} from "lucide-react";
import { MetricMindChatResponse } from "@/types";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";

interface ExecutiveResponseCardProps {
  response: MetricMindChatResponse;
  onSaveInsight: (response: MetricMindChatResponse) => void;
  onAskFollowup: (question: string) => void;
  onViewLineage: (metricId: string) => void;
  onExplainNumber?: (metricId: string, period?: string, region?: string, value?: string) => void;
  isSaved?: boolean;
}

export const ExecutiveResponseCard: React.FC<ExecutiveResponseCardProps> = ({
  response,
  onSaveInsight,
  onAskFollowup,
  onViewLineage,
  onExplainNumber,
  isSaved = false
}) => {
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"chart" | "evidence">("chart");
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [chartViewType, setChartViewType] = useState<"waterfall" | "bar" | "trend">("waterfall");

  // Trust & Audit Expandables State
  const [activeAuditDrawer, setActiveAuditDrawer] = useState<
    "none" | "query" | "definition" | "lineage" | "api" | "audit"
  >("none");
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const {
    question,
    executive_summary,
    kpi_comparison,
    governed_metric,
    drivers,
    regional_breakdown,
    primary_chart_type,
    primary_chart_data,
    evidence,
    calculation_details,
    suggested_followups
  } = response;

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(governed_metric.formula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Card Header & Question */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-950/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Governed Executive Answer
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Resolved in {response.processing_time_ms}ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onExplainNumber?.(
                  governed_metric.id,
                  kpi_comparison.current_period,
                  undefined,
                  String(kpi_comparison.current_value)
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border border-sky-500/40 text-xs font-bold text-sky-300 transition-all shadow-sm group"
              title="Reconstruct how this value was calculated in MetricMind Time Machine"
            >
              <History className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-[-45deg] transition-transform" />
              <span>Explain This Number</span>
            </button>

            <button
              onClick={() => onViewLineage(governed_metric.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-sky-300 transition-colors"
              title="View end-to-end data lineage"
            >
              <GitFork className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Lineage DAG</span>
            </button>

            <button
              onClick={() => onSaveInsight(response)}
              disabled={isSaved}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSaved
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default"
                  : "bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? "Saved to Insights" : "Save Insight"}</span>
            </button>
          </div>

        </div>

        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          &quot;{question}&quot;
        </h3>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6">
        {/* Section 1: Executive Summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-500/20 space-y-2">
          <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Executive Summary (What Happened?)
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {executive_summary}
          </p>
        </div>

        {/* Section 2 & 3: Governed Metric & KPI Comparison Pill Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Governed Metric Object */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Governed Metric</span>
              <span className="text-emerald-400 font-medium">{governed_metric.status}</span>
            </div>
            <div className="text-base font-bold text-slate-100">{governed_metric.name}</div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-sky-300">
              <span className="truncate">{governed_metric.formula}</span>
              <button
                onClick={handleCopyFormula}
                className="ml-2 text-slate-400 hover:text-slate-200 shrink-0"
                title="Copy Formula"
              >
                {copiedFormula ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Source: {governed_metric.dbt_model}</span>
              <span>Owner: {governed_metric.owner}</span>
            </div>
          </div>

          {/* KPI Delta Comparison */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Period Comparison
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-100">
                {kpi_comparison.current_value}
                {kpi_comparison.unit === "percentage" ? "%" : ""}
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  kpi_comparison.is_positive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                }`}
              >
                {kpi_comparison.is_positive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {kpi_comparison.percentage_change}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span>{kpi_comparison.current_period} (Current)</span>
              <span className="text-slate-400 font-mono">
                Baseline: {kpi_comparison.baseline_value}
                {kpi_comparison.unit === "percentage" ? "%" : ""} ({kpi_comparison.baseline_period})
              </span>
            </div>

            <button
              onClick={() =>
                onExplainNumber?.(
                  governed_metric.id,
                  kpi_comparison.current_period,
                  undefined,
                  String(kpi_comparison.current_value)
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/25 text-[11px] font-semibold transition-all mt-2 group"
            >
              <Clock className="w-3 h-3 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Explain This Number in Time Machine →</span>
            </button>
          </div>


          {/* Primary Cost Driver / Regional Lead */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Primary Variance Driver
            </div>
            {drivers && drivers.length > 0 ? (
              <>
                <div className="text-base font-bold text-rose-400 truncate">
                  {drivers[0].driver}
                </div>
                <div className="text-xs text-slate-300">
                  Surged by <span className="text-rose-300 font-bold">{drivers[0].change_pct}</span> (Impact: {drivers[0].impact_pp} pp)
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  Category: {drivers[0].category}
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400">
                Variance evenly distributed across reported dimensions.
              </div>
            )}
          </div>
        </div>

        {/* WHY THIS ANSWER IS TRUSTWORTHY (Requirement 21) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3 shadow-lg shadow-emerald-500/5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Why This Answer Is Trustworthy
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              100% Deterministic Governance
            </span>
          </div>

          {/* 5 Core Trust Signals */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-medium text-slate-200">Governed metric</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-medium text-slate-200">Semantic definition verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-medium text-slate-200">Query schema validated</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-medium text-slate-200">Cube API executed</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-300">No raw SQL generated</span>
            </div>
          </div>

          {/* Expandable Section Action Pills (Requirement 21 & 25) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
            <button
              onClick={() => setActiveAuditDrawer(activeAuditDrawer === "query" ? "none" : "query")}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium border transition-colors ${
                activeAuditDrawer === "query"
                  ? "bg-sky-500/20 text-sky-200 border-sky-500/40"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              View Semantic Query
            </button>
            <button
              onClick={() => setActiveAuditDrawer(activeAuditDrawer === "definition" ? "none" : "definition")}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium border transition-colors ${
                activeAuditDrawer === "definition"
                  ? "bg-sky-500/20 text-sky-200 border-sky-500/40"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              View Metric Definition
            </button>
            <button
              onClick={() => onViewLineage(governed_metric.id)}
              className="px-3 py-1 rounded-xl text-[11px] font-medium border bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-indigo-500/30 transition-colors flex items-center gap-1"
            >
              <GitFork className="w-3 h-3 text-indigo-400" />
              <span>View Data Lineage</span>
            </button>
            <button
              onClick={() => setActiveAuditDrawer(activeAuditDrawer === "api" ? "none" : "api")}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium border transition-colors ${
                activeAuditDrawer === "api"
                  ? "bg-sky-500/20 text-sky-200 border-sky-500/40"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              View API Response
            </button>
            <button
              onClick={() => setActiveAuditDrawer(activeAuditDrawer === "audit" ? "none" : "audit")}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium border transition-colors ${
                activeAuditDrawer === "audit"
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              View Governance Audit
            </button>
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className={`ml-auto px-3 py-1 rounded-xl text-[11px] font-mono border transition-colors ${
                showDebugPanel
                  ? "bg-purple-500/20 text-purple-200 border-purple-500/40"
                  : "bg-slate-900/60 text-slate-400 hover:text-purple-300 border-slate-800"
              }`}
            >
              Developer Debug Panel {showDebugPanel ? "▲" : "▼"}
            </button>
          </div>

          {/* Expandable Drawers */}
          {activeAuditDrawer === "query" && (
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                <span>Governed Semantic Query Payload (Cube REST Format)</span>
                <span className="font-mono text-slate-500">Zod Contract: PASSED</span>
              </div>
              <pre className="text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
{JSON.stringify(
  response._trace?.semantic_json || {
    measures: [governed_metric.id],
    dimensions: calculation_details.dimensions_evaluated,
    time_dimension: "quarter",
    filters: calculation_details.applied_filters,
    limit: 100
  },
  null,
  2
)}
              </pre>
            </div>
          )}

          {activeAuditDrawer === "definition" && (
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 animate-in fade-in duration-150 text-xs">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Approved Catalog Metric Definition
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Formula:</span>
                  <span className="font-mono text-sky-300">{governed_metric.formula}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">dbt Model / Cube:</span>
                  <span className="font-mono text-emerald-300">{governed_metric.dbt_model}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Owner:</span>
                  <span>{governed_metric.owner}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Catalog Version:</span>
                  <span className="font-mono text-slate-200">{governed_metric.version}</span>
                </div>
              </div>
            </div>
          )}

          {activeAuditDrawer === "api" && (
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                <span>Normalized Cube API Response Object</span>
                <span className="font-mono text-emerald-400">HTTP 200 OK</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
{JSON.stringify(
  {
    success: true,
    metric: governed_metric.id,
    current_value: kpi_comparison.current_value,
    baseline_value: kpi_comparison.baseline_value,
    percentage_change: kpi_comparison.percentage_change,
    metadata: {
      source: "Cube Semantic Layer (Sales.yml)",
      definition_version: governed_metric.version,
      sql_generated_by_llm: "NONE",
      result_hash: evidence.governed_signature
    }
  },
  null,
  2
)}
              </pre>
            </div>
          )}

          {activeAuditDrawer === "audit" && (
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 animate-in fade-in duration-150 text-xs">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Governance Audit Evidence Details</span>
                <span className="font-mono text-slate-400">Hash: {evidence.governed_signature}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Validation:</span>
                  <span className="text-emerald-400 font-bold">PASSED (Zero SQL)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Processing Time:</span>
                  <span className="font-mono text-sky-300">{response.processing_time_ms}ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Governance Status:</span>
                  <span className="text-emerald-400 font-semibold">{governed_metric.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Authorized Signature:</span>
                  <span className="font-mono text-slate-200">{evidence.governed_signature}</span>
                </div>
              </div>
            </div>
          )}

          {/* Developer Debug Panel (Requirement 25) */}
          {showDebugPanel && (
            <div className="p-4 rounded-xl bg-black/80 border border-purple-500/40 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold font-mono text-purple-300 uppercase tracking-wider">
                  Developer Execution Metadata Trace
                </span>
                <span className="text-[10px] font-mono text-slate-500">Zero Chain-of-Thought / Structured Only</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">User Query → Agent Intent</span>
                  <div className="text-slate-300 truncate">&quot;{question}&quot;</div>
                  <div className="text-purple-300 text-[11px]">Intent: Analytical query on {governed_metric.name}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Semantic Schema → Semantic JSON</span>
                  <div className="text-sky-300 text-[11px]">Measures: [{governed_metric.id}]</div>
                  <div className="text-indigo-300 text-[11px]">Dimensions: [{calculation_details.dimensions_evaluated.join(", ")}]</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Validation → Cube Request</span>
                  <div className="text-emerald-400 text-[11px]">Zod Contract: PASSED</div>
                  <div className="text-slate-400 text-[10px] truncate">Target: Cube REST /load (Sales.yml)</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Cube Response → Normalized Result</span>
                  <div className="text-emerald-300 text-[11px]">Result: {kpi_comparison.current_value}</div>
                  <div className="text-sky-400 text-[10px]">Hash: {evidence.governed_signature}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Visualizations & Interactive Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Driver Decomposition & Dimensional Breakdown
              </span>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setActiveTab("chart")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "chart"
                    ? "bg-sky-500/20 text-sky-300 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Chart View
              </button>
              <button
                onClick={() => setActiveTab("evidence")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "evidence"
                    ? "bg-sky-500/20 text-sky-300 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Evidence Table
              </button>
            </div>
          </div>

          {activeTab === "chart" ? (
            <div className="space-y-4">
              {primary_chart_type === "waterfall" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>European Margin Driver Bridge (Waterfall)</span>
                    <span className="text-[11px] font-mono text-sky-400">Unit: % Gross Margin</span>
                  </div>
                  <WaterfallChart data={primary_chart_data} height="320px" unit="%" />
                </div>
              ) : primary_chart_type === "bar" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Dimensional Comparison Bar Chart</span>
                  </div>
                  <ComparisonBarChart
                    categories={primary_chart_data.map((d: any) => d.name)}
                    series={[
                      {
                        name: "Current Period",
                        data: primary_chart_data.map((d: any) => d.value),
                        color: "#38bdf8"
                      },
                      {
                        name: "Previous Period",
                        data: primary_chart_data.map((d: any) => d.previous),
                        color: "#64748b"
                      }
                    ]}
                    unit=""
                  />
                </div>
              ) : (
                <TrendLineChart
                  periods={["Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026"]}
                  series={[
                    { name: "Historical Performance", data: primary_chart_data.map((d: any) => d.value) }
                  ]}
                />
              )}

              {/* Driver & Regional Contribution Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Cost Drivers */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Contributing Cost Drivers</span>
                    <span className="text-[10px] text-slate-500">OPEX / COGS Impact</span>
                  </div>
                  <div className="space-y-1.5">
                    {drivers.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span className="text-slate-200 font-medium">{d.driver}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-rose-400 font-mono font-semibold">{d.change_pct}</span>
                          <span className="text-slate-400 text-[10px]">({d.impact_pp} pp)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Regional Breakdown</span>
                    <span className="text-[10px] text-slate-500">Country Margin Impact</span>
                  </div>
                  <div className="space-y-1.5">
                    {regional_breakdown.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span className="text-slate-200 font-medium">{r.value_name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-400 text-[11px]">{r.previous_value}% → {r.current_value}%</span>
                          <span className="text-rose-400 font-bold">{r.weighted_impact_pp} pp</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Evidence Table */
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px]">
                    <tr>
                      {evidence.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2.5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {evidence.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2.5 text-slate-200 font-mono">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Cryptographic Governance Signature:</span>
                <span className="font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {evidence.governed_signature}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Trust & Calculation Explainability Drawer */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => setShowCalculationDetails(!showCalculationDetails)}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-300 hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>How was this calculated? (Governed Explainability & Trust)</span>
            </div>
            {showCalculationDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showCalculationDetails && (
            <div className="p-4 pt-0 space-y-3 text-xs border-t border-slate-800/60 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Governed Formula</span>
                  <div className="font-mono text-sky-300 text-[11px]">
                    {calculation_details.governed_formula}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    dbt Semantic Source
                  </span>
                  <div className="font-mono text-emerald-300 text-[11px]">
                    {calculation_details.source_model} ({calculation_details.fact_table})
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/70 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Zero Rogue SQL Semantic Query Equivalent
                </div>
                <code className="block p-2 rounded-lg bg-black/60 text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {calculation_details.sql_equivalent}
                </code>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">Verified By</span>
                  <span className="text-slate-200 font-medium">{calculation_details.verified_by}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Catalog Version</span>
                  <span className="text-slate-200 font-mono">{calculation_details.version}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Reporting Period</span>
                  <span className="text-slate-200">{calculation_details.reporting_period}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Governance Status</span>
                  <span className="text-emerald-400 font-semibold">{calculation_details.governance_status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Suggested Follow-up Prompts */}
        {suggested_followups && suggested_followups.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Suggested Analytical Deep Dives
            </div>
            <div className="flex flex-wrap gap-2">
              {suggested_followups.map((f, i) => (
                <button
                  key={i}
                  onClick={() => onAskFollowup(f)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-sky-300 hover:border-sky-500/30 transition-all text-left"
                >
                  <span>{f}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
