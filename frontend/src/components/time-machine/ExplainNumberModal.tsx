"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  History,
  Clock,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Share2,
  Download,
  Calendar,
  MapPin,
  Tag,
  GitCompare,
  Layers,
  Database,
  CheckCircle2,
  RotateCcw,
  Wand2
} from "lucide-react";
import { TimeMachineNumberExplanation } from "@/types/timeMachine";
import { api } from "@/lib/api";
import { TimeMachineTimeline } from "./TimeMachineTimeline";
import { MetricCalculationFlow } from "./MetricCalculationFlow";
import { MetricVersionCard } from "./MetricVersionCard";
import { DefinitionComparison } from "./DefinitionComparison";
import { DataSnapshotCard } from "./DataSnapshotCard";
import { FilterBreakdown } from "./FilterBreakdown";
import { DimensionBreakdown } from "./DimensionBreakdown";
import { MetricLineageGraph } from "./MetricLineageGraph";
import { MetricDependencyGraph } from "./MetricDependencyGraph";
import { HistoricalComparison } from "./HistoricalComparison";
import { AIExplanation } from "./AIExplanation";
import { ReproductionResult } from "./ReproductionResult";
import { AuditTrail } from "./AuditTrail";
import { TimeMachineSearch } from "./TimeMachineSearch";

interface ExplainNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricId?: string;
  initialPeriod?: string;
  initialRegion?: string;
  initialValue?: string;
  onSimulateChange?: (metricId: string, formula?: string) => void;
}

export const ExplainNumberModal: React.FC<ExplainNumberModalProps> = ({
  isOpen,
  onClose,
  metricId = "gross_margin",
  initialPeriod = "Q3 2026",
  initialRegion = "Europe",
  initialValue = "27.2%",
  onSimulateChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reconstruction" | "snapshot" | "lineage" | "comparison" | "audit"
  >("reconstruction");

  const [currentMetricId, setCurrentMetricId] = useState(metricId);
  const [currentPeriod, setCurrentPeriod] = useState(initialPeriod);
  const [currentRegion, setCurrentRegion] = useState(initialRegion);
  const [selectedVersion, setSelectedVersion] = useState<string>("v2.1");
  const [explanation, setExplanation] = useState<TimeMachineNumberExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  // Load data whenever metric, version, period, or region changes
  useEffect(() => {
    if (!isOpen) return;

    // Check if test case for unavailable historical version/metric
    if (currentMetricId.includes("unknown") || currentPeriod.includes("Unavailable")) {
      setIsUnavailable(true);
      return;
    }
    setIsUnavailable(false);

    loadReconstruction(currentMetricId, selectedVersion, currentPeriod, currentRegion);
  }, [isOpen, currentMetricId, selectedVersion, currentPeriod, currentRegion]);

  const loadReconstruction = async (mId: string, ver?: string, per?: string, reg?: string) => {
    setLoading(true);
    try {
      const data = await api.getTimeMachineMetric(mId, ver, per, reg);
      setExplanation(data);
      if (data && data.metric && data.metric.version) {
        setSelectedVersion(data.metric.version);
      }
    } catch (e) {
      console.error("Failed to load Time Machine data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistoricalVersion = (v: string) => {
    setSelectedVersion(v);
  };

  const handleSearch = (m: string, p: string, r: string) => {
    setCurrentMetricId(m);
    setCurrentPeriod(p);
    setCurrentRegion(r);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog Window */}
      <div
        className={`relative flex flex-col w-full bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 rounded-none z-50"
            : "max-w-6xl max-h-[92vh] h-[92vh]"
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 text-white shadow-lg shadow-sky-500/20 shrink-0">
              <History className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight flex items-center gap-2">
                  Explain This Number
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold uppercase tracking-wider">
                  MetricMind Time Machine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Reconstruct how this value was calculated. Never lose the history behind a number.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close Time Machine (Esc)"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Context Bar (Section 2 Requirements) */}
        <div className="px-5 sm:px-6 py-3 bg-slate-950/40 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Metric</span>
              <span className="font-bold text-slate-200 text-sm">
                {explanation?.metric.name || "Gross Margin"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Value</span>
              <span className="font-black text-sky-400 text-base font-mono">
                {explanation?.value.formatted || initialValue}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Period</span>
              <span className="font-bold text-slate-200 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" />
                {currentPeriod}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Region</span>
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                {currentRegion}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Definition</span>
              <span className="font-bold text-indigo-300 font-mono">
                {selectedVersion}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>

          {/* Quick Tagline */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>Tagline: &quot;Never lose the history behind a number.&quot;</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto shrink-0 text-xs">
          {[
            { id: "reconstruction", label: "Reconstruction & Formula", icon: <Clock className="w-3.5 h-3.5" /> },
            { id: "snapshot", label: "Data Snapshot & Filters", icon: <Database className="w-3.5 h-3.5" /> },
            { id: "lineage", label: "Lineage & Dependencies", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "comparison", label: "Compare Moments", icon: <GitCompare className="w-3.5 h-3.5" /> },
            { id: "audit", label: "Governance & Audit", icon: <ShieldCheck className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-3 border-b-2 font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "border-sky-400 text-sky-300 bg-sky-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Multi-Period Time Machine Search Bar */}
          <TimeMachineSearch
            selectedMetricId={currentMetricId}
            selectedPeriod={currentPeriod}
            selectedRegion={currentRegion}
            onSearch={handleSearch}
            isUnavailable={isUnavailable}
          />

          {!isUnavailable && explanation && (
            <>
              {/* TAB 1: Reconstruction & Formula */}
              {activeTab === "reconstruction" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Visual Calculation Flow */}
                  <MetricCalculationFlow
                    calculationFlow={explanation.calculation_flow}
                    metricName={explanation.metric.name}
                    finalValue={explanation.value.formatted_display}
                    formattedComponents={explanation.formatted_components}
                  />

                  {/* Visual Timeline Track */}
                  <TimeMachineTimeline
                    versions={explanation.timeline_versions}
                    selectedVersion={selectedVersion}
                    onSelectVersion={handleSelectHistoricalVersion}
                    currentPeriodLabel={currentPeriod}
                  />

                  {/* "WHAT CHANGED?" Section (Section 7) */}
                  <DefinitionComparison
                    changeDate="18 Sep 2026"
                    previousFormula="((Revenue - Cost) / Revenue) × 100"
                    currentFormula={explanation.metric.formula}
                    impactPp={-1.9}
                    affectedDashboards={14}
                    affectedReports={8}
                    affectedSavedInsights={23}
                  />

                  {/* Semantic Metric Definition Card (Section 5) */}
                  <MetricVersionCard
                    name={explanation.metric.name}
                    version={selectedVersion}
                    formula={explanation.metric.formula}
                    description={explanation.metric.description}
                    owner={explanation.metric.owner}
                    status={explanation.metric.status}
                    effectiveFrom={explanation.metric.effective_from}
                  />
                </div>
              )}

              {/* TAB 2: Data Snapshot & Filters */}
              {activeTab === "snapshot" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Data Snapshot Card (Section 9) */}
                  <DataSnapshotCard snapshot={explanation.snapshot} />

                  {/* Filters Used Breakdown (Section 10) */}
                  <FilterBreakdown filters={explanation.filters} />

                  {/* Dimension Breakdown Hierarchy (Section 11) */}
                  <DimensionBreakdown items={explanation.dimension_breakdown?.items || []} />
                </div>
              )}

              {/* TAB 3: Lineage & Dependencies */}
              {activeTab === "lineage" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Data Lineage DAG (Section 12) */}
                  <MetricLineageGraph
                    nodes={explanation.lineage?.nodes || []}
                    edges={explanation.lineage?.edges || []}
                  />

                  {/* Metric Dependency Graph (Section 13) */}
                  <MetricDependencyGraph dependencyGraph={explanation.dependency_graph || []} />
                </div>
              )}

              {/* TAB 4: Compare Moments */}
              {activeTab === "comparison" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Historical Comparison & Moment Comparator (Section 8, 20, 21) */}
                  <HistoricalComparison
                    currentValue={explanation.value.current}
                    currentFormatted={explanation.value.formatted_display}
                    previousValue={explanation.counterfactual.previous_value}
                    previousFormatted={explanation.counterfactual.previous_formatted}
                    differencePp={explanation.counterfactual.difference_pp}
                  />
                </div>
              )}

              {/* TAB 5: Governance & Audit */}
              {activeTab === "audit" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Reproduce This Number (Section 17) */}
                  <ReproductionResult
                    metricId={explanation.metric.id}
                    metricName={explanation.metric.name}
                    originalValue={explanation.value.current}
                    originalFormatted={explanation.value.formatted_display}
                    fingerprint={explanation.governance.fingerprint}
                    snapshotId={explanation.snapshot.id}
                  />

                  {/* Audit Trail & Number Hash (Section 16 & 18) */}
                  <AuditTrail
                    questionOrKpi={explanation.metric.name}
                    value={explanation.value.formatted_display}
                    version={selectedVersion}
                    queryId={explanation.governance.query_id}
                    snapshotId={explanation.snapshot.id}
                    executedDate={explanation.audit_trail.executed_at}
                    source={explanation.governance.source}
                    fingerprint={explanation.governance.fingerprint}
                  />

                  {/* AI Explanation & Trust Boundary (Section 14 & 15) */}
                  <AIExplanation
                    summary={explanation.ai_explanation.summary}
                    narrative={explanation.ai_explanation.narrative}
                    trustBoundaryNotice={explanation.ai_explanation.trust_boundary_notice}
                    verifiedInputs={explanation.ai_explanation.verified_inputs}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-800/80 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Calculation Fingerprint: {explanation?.governance.fingerprint || "MM-GM-V21-Q3-EU-7A82F"}</span>
          </div>

          <div className="flex items-center gap-2">
            {onSimulateChange && (
              <button
                onClick={() => {
                  onClose();
                  onSimulateChange(
                    currentMetricId,
                    explanation?.metric.formula || "((Revenue - Cost - Logistics Cost) / Revenue) * 100"
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all shadow-sm shadow-purple-500/10"
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Simulate Definition Change</span>
              </button>
            )}

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `MetricMind Time Machine: ${explanation?.metric.name} was ${explanation?.value.formatted_display} in ${currentPeriod} (${currentRegion}) under definition ${selectedVersion}. Fingerprint: ${explanation?.governance.fingerprint}`
                );
                alert("Audit verification summary copied to clipboard!");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Share Audit Summary</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-sky-500/20"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
