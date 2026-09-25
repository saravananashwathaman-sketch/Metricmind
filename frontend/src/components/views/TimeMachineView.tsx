"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  MapPin,
  GitCompare,
  Layers,
  Database,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  HardDrive
} from "lucide-react";
import { TimeMachineNumberExplanation } from "@/types/timeMachine";
import { api } from "@/lib/api";
import { TimeMachineTimeline } from "../time-machine/TimeMachineTimeline";
import { MetricCalculationFlow } from "../time-machine/MetricCalculationFlow";
import { MetricVersionCard } from "../time-machine/MetricVersionCard";
import { DefinitionComparison } from "../time-machine/DefinitionComparison";
import { DataSnapshotCard } from "../time-machine/DataSnapshotCard";
import { FilterBreakdown } from "../time-machine/FilterBreakdown";
import { DimensionBreakdown } from "../time-machine/DimensionBreakdown";
import { MetricLineageGraph } from "../time-machine/MetricLineageGraph";
import { MetricDependencyGraph } from "../time-machine/MetricDependencyGraph";
import { HistoricalComparison } from "../time-machine/HistoricalComparison";
import { AIExplanation } from "../time-machine/AIExplanation";
import { ReproductionResult } from "../time-machine/ReproductionResult";
import { AuditTrail } from "../time-machine/AuditTrail";
import { TimeMachineSearch } from "../time-machine/TimeMachineSearch";

interface TimeMachineViewProps {
  onAskQuestion?: (q: string) => void;
  initialMetricId?: string;
  initialPeriod?: string;
  initialRegion?: string;
}

export const TimeMachineView: React.FC<TimeMachineViewProps> = ({
  onAskQuestion,
  initialMetricId = "gross_margin",
  initialPeriod = "Q3 2026",
  initialRegion = "Europe"
}) => {
  const [metricId, setMetricId] = useState(initialMetricId);
  const [period, setPeriod] = useState(initialPeriod);
  const [region, setRegion] = useState(initialRegion);
  const [selectedVersion, setSelectedVersion] = useState("v2.1");
  const [explanation, setExplanation] = useState<TimeMachineNumberExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reconstruction" | "snapshot" | "lineage" | "comparison" | "audit"
  >("reconstruction");

  useEffect(() => {
    if (metricId.includes("unknown") || period.includes("Unavailable")) {
      setIsUnavailable(true);
      return;
    }
    setIsUnavailable(false);
    loadData(metricId, selectedVersion, period, region);
  }, [metricId, selectedVersion, period, region]);

  const loadData = async (mId: string, ver?: string, per?: string, reg?: string) => {
    setLoading(true);
    try {
      const data = await api.getTimeMachineMetric(mId, ver, per, reg);
      setExplanation(data);
      if (data && data.metric && data.metric.version) {
        setSelectedVersion(data.metric.version);
      }
    } catch (e) {
      console.error("Failed to load time machine data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (m: string, p: string, r: string) => {
    setMetricId(m);
    setPeriod(p);
    setRegion(r);
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Signature Feature Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-sky-400" />
              <span>MetricMind Time Machine • Signature Feature</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Explain This Number
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              &quot;Never lose the history behind a number.&quot; Reconstruct how any business value was calculated past or present, explore definition changes, inspect immutable snapshots, and verify bit-for-bit repeatability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Snapshot</span>
              <span className="text-xs font-bold text-sky-300 font-mono">
                {explanation?.snapshot.id || "SNAP-2026-Q3-EU-001"}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Time Machine Search Bar */}
      <TimeMachineSearch
        selectedMetricId={metricId}
        selectedPeriod={period}
        selectedRegion={region}
        onSearch={handleSearch}
        isUnavailable={isUnavailable}
      />

      {!isUnavailable && explanation && (
        <>
          {/* Key Value Overview Strip */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Metric</span>
                <span className="text-base sm:text-lg font-black text-slate-100">{explanation.metric.name}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Current Value</span>
                <span className="text-2xl font-black text-sky-400 font-mono tracking-tight">
                  {explanation.value.formatted_display}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Period</span>
                <span className="text-sm font-bold text-slate-200 font-mono flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {period}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Region</span>
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {region}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Active Definition</span>
                <span className="text-sm font-bold text-indigo-300 font-mono mt-0.5 block">
                  {selectedVersion}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Verified Semantic Governance
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-900/60 p-1.5 rounded-2xl overflow-x-auto text-xs">
            {[
              { id: "reconstruction", label: "Reconstruction & Formula Flow", icon: <Clock className="w-4 h-4" /> },
              { id: "snapshot", label: "Data Snapshot & Filters", icon: <Database className="w-4 h-4" /> },
              { id: "lineage", label: "Lineage & Dependencies", icon: <Layers className="w-4 h-4" /> },
              { id: "comparison", label: "Historical Comparison & Moments", icon: <GitCompare className="w-4 h-4" /> },
              { id: "audit", label: "Governance & Audit Trail", icon: <ShieldCheck className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            {activeTab === "reconstruction" && (
              <div className="space-y-6">
                <MetricCalculationFlow
                  calculationFlow={explanation.calculation_flow}
                  metricName={explanation.metric.name}
                  finalValue={explanation.value.formatted_display}
                  formattedComponents={explanation.formatted_components}
                />

                <TimeMachineTimeline
                  versions={explanation.timeline_versions}
                  selectedVersion={selectedVersion}
                  onSelectVersion={setSelectedVersion}
                  currentPeriodLabel={period}
                />

                <DefinitionComparison
                  changeDate="18 Sep 2026"
                  previousFormula="((Revenue - Cost) / Revenue) × 100"
                  currentFormula={explanation.metric.formula}
                  impactPp={-1.9}
                  affectedDashboards={14}
                  affectedReports={8}
                  affectedSavedInsights={23}
                />

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

            {activeTab === "snapshot" && (
              <div className="space-y-6">
                <DataSnapshotCard snapshot={explanation.snapshot} />
                <FilterBreakdown filters={explanation.filters} />
                <DimensionBreakdown items={explanation.dimension_breakdown?.items || []} />
              </div>
            )}

            {activeTab === "lineage" && (
              <div className="space-y-6">
                <MetricLineageGraph
                  nodes={explanation.lineage?.nodes || []}
                  edges={explanation.lineage?.edges || []}
                />
                <MetricDependencyGraph dependencyGraph={explanation.dependency_graph || []} />
              </div>
            )}

            {activeTab === "comparison" && (
              <div className="space-y-6">
                <HistoricalComparison
                  currentValue={explanation.value.current}
                  currentFormatted={explanation.value.formatted_display}
                  previousValue={explanation.counterfactual.previous_value}
                  previousFormatted={explanation.counterfactual.previous_formatted}
                  differencePp={explanation.counterfactual.difference_pp}
                />
              </div>
            )}

            {activeTab === "audit" && (
              <div className="space-y-6">
                <ReproductionResult
                  metricId={explanation.metric.id}
                  metricName={explanation.metric.name}
                  originalValue={explanation.value.current}
                  originalFormatted={explanation.value.formatted_display}
                  fingerprint={explanation.governance.fingerprint}
                  snapshotId={explanation.snapshot.id}
                />

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

                <AIExplanation
                  summary={explanation.ai_explanation.summary}
                  narrative={explanation.ai_explanation.narrative}
                  trustBoundaryNotice={explanation.ai_explanation.trust_boundary_notice}
                  verifiedInputs={explanation.ai_explanation.verified_inputs}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
