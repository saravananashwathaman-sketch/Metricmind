"use client";

import React, { useState } from "react";
import { Search, Calendar, MapPin, Database, ArrowRight, AlertCircle } from "lucide-react";

interface TimeMachineSearchProps {
  selectedMetricId: string;
  selectedPeriod: string;
  selectedRegion: string;
  onSearch: (metricId: string, period: string, region: string) => void;
  isUnavailable?: boolean;
}

export const TimeMachineSearch: React.FC<TimeMachineSearchProps> = ({
  selectedMetricId,
  selectedPeriod,
  selectedRegion,
  onSearch,
  isUnavailable = false
}) => {
  const [metric, setMetric] = useState(selectedMetricId);
  const [period, setPeriod] = useState(selectedPeriod);
  const [region, setRegion] = useState(selectedRegion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(metric, period, region);
  };

  const metricOptions = [
    { id: "gross_margin", label: "Gross Margin %" },
    { id: "revenue", label: "Gross Revenue" },
    { id: "net_profit", label: "Net Operating Profit" },
    { id: "churn_rate", label: "Customer Churn Rate" },
    { id: "order_count", label: "Enterprise Order Count" },
    { id: "synthetic_metric_unknown", label: "⚠ Legacy Synthetic Index (Unavailable Test)" }
  ];

  const periodOptions = [
    "Q3 2026",
    "Q2 2026",
    "Q1 2026",
    "Q4 2025",
    "Q3 2025",
    "Q2 2024 (Pre-archive Archive Unavailable)"
  ];

  const regionOptions = ["Europe", "Global", "North America", "India", "APAC"];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            TIME MACHINE SEARCH &amp; TIME TRAVEL
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">Select any metric, period, or theater</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {/* Metric Selector */}
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Database className="w-3 h-3 text-sky-400" />
            Metric
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-sky-500/50"
          >
            {metricOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Period Selector */}
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-400" />
            Historical Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-sky-500/50"
          >
            {periodOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Region Selector */}
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" />
            Geographic Scope
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-sky-500/50"
          >
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Travel Button */}
        <div className="flex flex-col justify-end">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 active:scale-95 h-[38px]"
          >
            <span>Travel Through Time</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Unavailable Fallback Warning (Section 32 & Test 8) */}
      {(isUnavailable || metric.includes("unknown") || period.includes("Unavailable")) && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <strong className="font-bold">Historical reconstruction unavailable for this period.</strong>
            <p className="text-[11px] text-rose-300/80 mt-0.5">
              MetricMind governance policy strictly forbids fabricating historical formulas or backfilling unverified assumptions when archived snapshots do not exist.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
