"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  Maximize2,
  Minimize2,
  Share2,
  Calendar,
  MapPin,
  GitCompare,
  Layers,
  Database,
  ShieldCheck,
  Wand2,
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
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { PrimaryButton, SecondaryButton } from "@/components/design-system/Buttons";

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
  onSimulateChange,
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

  useEffect(() => {
    if (!isOpen) return;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#020617]/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`relative flex flex-col w-full bg-[#1E293B] border border-[#334155] shadow-2xl rounded-2xl overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? "fixed inset-0 rounded-none z-50"
            : "max-w-6xl max-h-[92vh] h-[92vh]"
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0F172A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#4F46E5]/20 text-[#818CF8] border border-[#4F46E5]/30 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                  Explain This Number
                </h2>
                <StatusBadge status="verified" label="Time Machine" />
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Understand exactly how this metric was calculated.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Context Bar: Metric, Value, Period, Region, Definition Version, Governance Status */}
        <div className="px-6 py-3 bg-[#020617]/50 border-b border-[#334155] flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Metric</span>
              <span className="font-bold text-[#F8FAFC]">
                {explanation?.metric.name || "Gross Margin"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Value</span>
              <span className="font-bold text-[#F8FAFC] text-sm font-mono">
                {explanation?.value.formatted || initialValue}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Period</span>
              <span className="font-semibold text-[#F8FAFC] font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#06B6D4]" />
                {currentPeriod}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Region</span>
              <span className="font-semibold text-[#F8FAFC] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#4F46E5]" />
                {currentRegion}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Definition Version</span>
              <span className="font-semibold text-[#818CF8] font-mono">
                {selectedVersion}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Governance Status</span>
              <div className="mt-0.5">
                <StatusBadge status="verified" label="Verified" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-[#334155] bg-[#0F172A] overflow-x-auto shrink-0 text-xs">
          {[
            { id: "reconstruction", label: "Calculation Flow & Timeline", icon: <Clock className="w-3.5 h-3.5" /> },
            { id: "snapshot", label: "Data Snapshot & Filters", icon: <Database className="w-3.5 h-3.5" /> },
            { id: "lineage", label: "Lineage & Dependencies", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "comparison", label: "Compare Moments", icon: <GitCompare className="w-3.5 h-3.5" /> },
            { id: "audit", label: "Governance & Audit", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#4F46E5] text-[#F8FAFC] bg-[#1E293B]"
                  : "border-transparent text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <TimeMachineSearch
            selectedMetricId={currentMetricId}
            selectedPeriod={currentPeriod}
            selectedRegion={currentRegion}
            onSearch={handleSearch}
            isUnavailable={isUnavailable}
          />

          {!isUnavailable && explanation && (
            <>
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
                    onSelectVersion={handleSelectHistoricalVersion}
                    currentPeriodLabel={currentPeriod}
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
            </>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 border-t border-[#334155] bg-[#0F172A] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Fingerprint: {explanation?.governance.fingerprint || "MM-GM-V21-Q3-EU-7A82F"}</span>
          </div>

          <div className="flex items-center gap-2">
            {onSimulateChange && (
              <SecondaryButton
                size="sm"
                icon={<Wand2 className="w-3.5 h-3.5 text-[#F59E0B]" />}
                onClick={() => {
                  onClose();
                  onSimulateChange(
                    currentMetricId,
                    explanation?.metric.formula || "((Revenue - Cost - Logistics Cost) / Revenue) * 100"
                  );
                }}
              >
                Simulate Definition Change
              </SecondaryButton>
            )}

            <PrimaryButton size="sm" onClick={onClose}>
              Done
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
