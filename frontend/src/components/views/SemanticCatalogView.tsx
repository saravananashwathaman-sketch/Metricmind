"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Code2,
  Database,
  GitFork,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Filter
} from "lucide-react";
import { MetricDefinition } from "@/types";
import { api } from "@/lib/api";
import { GOVERNED_METRIC_CATALOG } from "@/lib/mockData";

interface SemanticCatalogViewProps {
  onAskQuestion: (q: string) => void;
  onViewLineage: (metricId: string) => void;
}

export const SemanticCatalogView: React.FC<SemanticCatalogViewProps> = ({
  onAskQuestion,
  onViewLineage
}) => {
  const [metrics, setMetrics] = useState<MetricDefinition[]>(GOVERNED_METRIC_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | null>(GOVERNED_METRIC_CATALOG[3]); // Gross Margin
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, [selectedCategory, selectedStatus]);

  const loadMetrics = async () => {
    const cat = selectedCategory === "All" ? undefined : selectedCategory;
    const stat = selectedStatus === "All" ? undefined : selectedStatus;
    const list = await api.getMetrics(cat, stat);
    setMetrics(list);
  };

  const handleVerify = async (metricId: string) => {
    setIsVerifying(true);
    await api.verifyMetric(metricId, "Priya Sharma", "VP Strategic Finance");
    setIsVerifying(false);
    setVerificationSuccess(true);
    setTimeout(() => setVerificationSuccess(false), 3000);
    loadMetrics();
  };

  const filteredMetrics = metrics.filter((m) => {
    const matchesSearch =
      m.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.formula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-sky-400" />
            Governed Semantic Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Single Source of Truth for enterprise metric definitions, mathematical formulas, and governance owners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>9 Governed Metrics Active</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search metric name, formula, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Profitability">Profitability</option>
            <option value="Revenue">Revenue</option>
            <option value="Customer">Customer</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Under Review">Under Review</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metric Cards List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredMetrics.map((m) => {
            const isSelected = selectedMetric?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMetric(m)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? "bg-slate-900 border-sky-500/50 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30"
                    : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">{m.display_name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      v{m.version}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      m.status === "Verified"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {m.status === "Verified" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {m.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{m.description}</p>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-sky-300 flex items-center justify-between">
                  <span className="truncate">{m.formula}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <UserCheck className="w-3 h-3 text-sky-400" />
                    {m.owner} ({m.owner_role})
                  </span>
                  <span>Usage: {m.usage_count} queries</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-dive Metric Inspection Panel */}
        <div className="lg:col-span-5">
          {selectedMetric ? (
            <div className="sticky top-20 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                    {selectedMetric.category} Metric
                  </span>
                  <h3 className="text-lg font-black text-slate-100">
                    {selectedMetric.display_name}
                  </h3>
                </div>
                <button
                  onClick={() => onViewLineage(selectedMetric.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-medium transition-colors"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Lineage DAG</span>
                </button>
              </div>

              {/* Formula & Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Governed Mathematical Formula</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMetric.formula);
                      setCopiedFormula(true);
                      setTimeout(() => setCopiedFormula(false), 2000);
                    }}
                    className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedFormula ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span className="text-[10px]">{copiedFormula ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono text-sky-300">
                  {selectedMetric.formula}
                </div>
              </div>

              {/* SQL Equivalent */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  dbt Transformation SQL Assertion
                </div>
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {selectedMetric.formula_sql}
                </div>
              </div>

              {/* Dimensions Supported */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Supported Analytical Dimensions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMetric.supported_dimensions.map((dim) => (
                    <span
                      key={dim}
                      className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono"
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lineage & Storage */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">dbt Model</span>
                  <div className="text-slate-200 font-mono text-[11px] truncate">
                    {selectedMetric.dbt_model}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Fact Table</span>
                  <div className="text-slate-200 font-mono text-[11px] truncate">
                    {selectedMetric.data_source}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => onAskQuestion(`Why did our ${selectedMetric.display_name} change last quarter?`)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20 text-center"
                >
                  Ask MetricMind →
                </button>

                <button
                  onClick={() => handleVerify(selectedMetric.id)}
                  disabled={isVerifying || selectedMetric.status === "Verified"}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors disabled:opacity-40"
                >
                  {verificationSuccess ? "Verified ✓" : "Verify Metric"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-xs">
              Select any governed metric to inspect definitions, dimensional grain, and data lineage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
