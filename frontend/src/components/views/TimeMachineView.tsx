"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  ShieldCheck,
  Calendar,
  MapPin,
  GitCompare,
  Layers,
  Database,
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
import { StatusBadge } from "@/components/design-system/StatusBadge";

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
  initialRegion = "Europe",
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
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Exact Requested Header & Subheading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
              Metric Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-[#06B6D4]" />
            Explain This Number
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Understand exactly how this metric was calculated.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#94A3B8] bg-[#1E293B] px-3 py-1.5 rounded-xl border border-[#334155]">
            Snapshot: {explanation?.snapshot.id || "SNAP-2026-Q3-EU-001"}
          </span>
        </div>
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
          {/* Exact Requested Metadata Strip: Metric, Value, Period, Region, Definition Version, Governance Status */}
          <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Metric
                </span>
                <span className="text-base font-bold text-[#F8FAFC]">
                  {explanation.metric.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Value
                </span>
                <span className="text-2xl font-bold text-[#F8FAFC] font-mono tracking-tight">
                  {explanation.value.formatted_display}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Period
                </span>
                <span className="text-sm font-semibold text-[#F8FAFC] font-mono flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#06B6D4]" />
                  {period}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Region
                </span>
                <span className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#4F46E5]" />
                  {region}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Definition Version
                </span>
                <span className="text-sm font-semibold text-[#F8FAFC] font-mono mt-0.5 block">
                  {selectedVersion}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Governance Status
                </span>
                <div className="mt-0.5">
                  <StatusBadge status="verified" label="Verified Passed" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-[#334155] bg-[#0F172A] p-1.5 rounded-xl overflow-x-auto text-xs">
            {[
              { id: "reconstruction", label: "Calculation Flow & Timeline", icon: <Clock className="w-4 h-4" /> },
              { id: "snapshot", label: "Data Snapshot & Filters", icon: <Database className="w-4 h-4" /> },
              { id: "lineage", label: "Lineage & Dependencies", icon: <Layers className="w-4 h-4" /> },
              { id: "comparison", label: "Historical Comparison", icon: <GitCompare className="w-4 h-4" /> },
              { id: "audit", label: "Governance & Audit Trail", icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
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
                  affectedDependentMetrics={4}
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
