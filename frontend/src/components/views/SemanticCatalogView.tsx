"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  GitFork,
  Check,
  Copy,
  Filter,
  Wand2,
} from "lucide-react";
import { MetricDefinition } from "@/types";
import { api } from "@/lib/api";
import { GOVERNED_METRIC_CATALOG } from "@/lib/mockData";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { PrimaryButton, SecondaryButton } from "@/components/design-system/Buttons";

interface SemanticCatalogViewProps {
  onAskQuestion: (q: string) => void;
  onViewLineage: (metricId: string) => void;
  onSimulateChange?: (metricId: string, formula?: string) => void;
}

export const SemanticCatalogView: React.FC<SemanticCatalogViewProps> = ({
  onAskQuestion,
  onViewLineage,
  onSimulateChange,
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
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
              Semantic Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#4F46E5]" />
            Governed Semantic Catalog
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Single source of metric truth with version-controlled definitions and strict Cube contracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="verified" label="9 Governed Metrics Active" size="md" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#020617] border border-[#334155] focus-within:border-[#4F46E5] flex-1 transition-colors">
          <Search className="w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search metric name, formula, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8]">
          <Filter className="w-3.5 h-3.5 text-[#06B6D4]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0F172A] text-[#F8FAFC]">All Categories</option>
            <option value="Profitability" className="bg-[#0F172A] text-[#F8FAFC]">Profitability</option>
            <option value="Revenue" className="bg-[#0F172A] text-[#F8FAFC]">Revenue</option>
            <option value="Customer" className="bg-[#0F172A] text-[#F8FAFC]">Customer</option>
            <option value="Operations" className="bg-[#0F172A] text-[#F8FAFC]">Operations</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent border-none text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0F172A] text-[#F8FAFC]">All Statuses</option>
            <option value="Verified" className="bg-[#0F172A] text-[#F8FAFC]">Verified</option>
            <option value="Under Review" className="bg-[#0F172A] text-[#F8FAFC]">Under Review</option>
            <option value="Draft" className="bg-[#0F172A] text-[#F8FAFC]">Draft</option>
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
                    ? "bg-[#1E293B] border-[#4F46E5] shadow-sm"
                    : "bg-[#1E293B]/70 border-[#334155] hover:bg-[#1E293B] hover:border-[#475569]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#F8FAFC]">{m.display_name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F172A] text-[#94A3B8] border border-[#334155]">
                      v{m.version}
                    </span>
                  </div>
                  <StatusBadge status={m.status} />
                </div>

                <p className="text-xs text-[#94A3B8] line-clamp-2">{m.description}</p>

                <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-xs font-mono text-[#06B6D4] flex items-center justify-between">
                  <span className="truncate">{m.formula}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                  <span className="flex items-center gap-1 text-[#94A3B8]">
                    <UserCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
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
            <div className="sticky top-20 p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider">
                    {selectedMetric.category} Metric
                  </span>
                  <h3 className="text-base font-bold text-[#F8FAFC]">
                    {selectedMetric.display_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onViewLineage(selectedMetric.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#020617] border border-[#334155] text-xs text-[#F8FAFC] font-medium transition-colors cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Lineage DAG</span>
                </button>
              </div>

              {/* Formula & Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  <span>Governed Mathematical Formula</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMetric.formula);
                      setCopiedFormula(true);
                      setTimeout(() => setCopiedFormula(false), 2000);
                    }}
                    className="text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedFormula ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                    <span className="text-[10px]">{copiedFormula ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] text-xs font-mono text-[#06B6D4]">
                  {selectedMetric.formula}
                </div>
              </div>

              {/* SQL Equivalent */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  dbt Transformation SQL
                </div>
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] text-[11px] font-mono text-[#10B981] overflow-x-auto">
                  {selectedMetric.formula_sql}
                </div>
              </div>

              {/* Dimensions Supported */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Supported Analytical Dimensions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMetric.supported_dimensions.map((dim) => (
                    <span
                      key={dim}
                      className="px-2 py-0.5 rounded-md bg-[#0F172A] text-[#94A3B8] border border-[#334155] text-[11px] font-mono"
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lineage & Storage */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
                  <span className="text-[10px] text-[#64748B] font-bold uppercase">dbt Model</span>
                  <div className="text-[#F8FAFC] font-mono text-[11px] truncate">
                    {selectedMetric.dbt_model}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1">
                  <span className="text-[10px] text-[#64748B] font-bold uppercase">Fact Table</span>
                  <div className="text-[#F8FAFC] font-mono text-[11px] truncate">
                    {selectedMetric.data_source}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#334155] flex flex-wrap items-center justify-between gap-2.5">
                {onSimulateChange && (
                  <button
                    type="button"
                    onClick={() => onSimulateChange(selectedMetric.id, selectedMetric.formula)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Simulate</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onAskQuestion(`Why did our ${selectedMetric.display_name} change last quarter?`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-[#F8FAFC] text-xs font-semibold transition-colors text-center cursor-pointer"
                >
                  Ask MetricMind →
                </button>

                <button
                  type="button"
                  onClick={() => handleVerify(selectedMetric.id)}
                  disabled={isVerifying || selectedMetric.status === "Verified"}
                  className="px-3.5 py-2 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {verificationSuccess ? "Verified ✓" : "Verify Metric"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#1E293B] border border-[#334155] text-center text-[#64748B] text-xs">
              Select any governed metric to inspect definitions, dimensional grain, and data lineage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
