"use client";

import React, { useState, useEffect } from "react";
import {
  Wand2,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BookmarkCheck,
  Download,
  Send,
} from "lucide-react";
import { MetricSelector } from "@/components/impact/MetricSelector";
import { DefinitionEditor } from "@/components/impact/DefinitionEditor";
import { CurrentVsProposedCard } from "@/components/impact/CurrentVsProposedCard";
import { ImpactSummary } from "@/components/impact/ImpactSummary";
import { DependencyGraph } from "@/components/impact/DependencyGraph";
import { ImpactHeatmap } from "@/components/impact/ImpactHeatmap";
import { AffectedDashboards } from "@/components/impact/AffectedDashboards";
import { AffectedReports } from "@/components/impact/AffectedReports";
import { AffectedQueries } from "@/components/impact/AffectedQueries";
import { DependentMetrics } from "@/components/impact/DependentMetrics";
import { ScenarioComparison } from "@/components/impact/ScenarioComparison";
import { GovernanceValidation } from "@/components/impact/GovernanceValidation";
import { AIAgentSimulationPrompt } from "@/components/impact/AIAgentSimulationPrompt";
import { SimulationAudit } from "@/components/impact/SimulationAudit";
import { ImpactReportModal } from "@/components/impact/ImpactReportModal";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { PrimaryButton, SecondaryButton } from "@/components/design-system/Buttons";

import {
  ChangeType,
  SimulationResult,
  StrictSimulationContract,
  SimulationAuditRecord,
} from "@/types/impact";
import {
  IMPACT_METRICS_CATALOG,
  runMetricSimulation,
  getAuditTrail,
} from "@/lib/impactSimulator";
import { api } from "@/lib/api";
import { Role } from "@/types";

interface MetricImpactViewProps {
  initialMetricId?: string;
  initialFormula?: string;
  isHistoricalMode?: boolean;
  userRole?: Role;
  onNavigateTab?: (tab: string) => void;
}

export const MetricImpactView: React.FC<MetricImpactViewProps> = ({
  initialMetricId = "gross_margin",
  initialFormula,
  isHistoricalMode = false,
  userRole = "Executive",
  onNavigateTab,
}) => {
  const [selectedMetricId, setSelectedMetricId] = useState(initialMetricId);
  const [changeType, setChangeType] = useState<ChangeType>("formula_change");
  const [proposedFormula, setProposedFormula] = useState(
    initialFormula || "((Revenue - Cost - Logistics Cost) / Revenue) * 100"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [auditRecords, setAuditRecords] = useState<SimulationAuditRecord[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [activeAssetCategory, setActiveAssetCategory] = useState<string>("all");

  const metric = IMPACT_METRICS_CATALOG[selectedMetricId] || IMPACT_METRICS_CATALOG.gross_margin;

  useEffect(() => {
    executeSimulation();
    loadAudit();
  }, [selectedMetricId]);

  const loadAudit = () => {
    setAuditRecords(getAuditTrail());
  };

  const executeSimulation = async () => {
    setIsRunning(true);
    try {
      const res = await api.simulateMetricImpact({
        metric: selectedMetricId,
        change_type: changeType,
        formula: proposedFormula,
        user_name: userRole === "Admin" ? "Priya Sharma" : "Ashwathaman",
      });

      if (res.simulation) {
        setSimulation(res.simulation);
      } else {
        const localSim = runMetricSimulation(
          selectedMetricId,
          proposedFormula,
          changeType,
          { region: "Europe", period: "Q3 2026" },
          userRole === "Admin" ? "Priya Sharma" : "Ashwathaman"
        );
        setSimulation(localSim);
      }
      loadAudit();
    } catch (e) {
      console.error("Simulation error", e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSelectMetric = (mId: string) => {
    setSelectedMetricId(mId);
    const m = IMPACT_METRICS_CATALOG[mId] || IMPACT_METRICS_CATALOG.gross_margin;
    if (mId === "gross_margin") {
      setProposedFormula("((Revenue - Cost - Logistics Cost) / Revenue) * 100");
    } else if (mId === "revenue") {
      setProposedFormula("SUM(revenue) - SUM(disputed_credits)");
    } else if (mId === "cost") {
      setProposedFormula("SUM(cost) + SUM(carrier_fuel_drag)");
    } else {
      setProposedFormula(m.formula);
    }
  };

  const handleApplyAiContract = (contract: StrictSimulationContract) => {
    setSelectedMetricId(contract.metric);
    setChangeType(contract.change_type as ChangeType);
    setProposedFormula(contract.proposed_definition.formula);
  };

  const handleReset = () => {
    setProposedFormula(metric.formula);
    setChangeType("formula_change");
  };

  const handleSaveSimulation = () => {
    if (!simulation) return;
    setSaveSuccessNotice(`Simulation ${simulation.simulation_id} saved to governance draft catalog.`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
    setIsReportModalOpen(false);
  };

  const handleSubmitReview = async () => {
    if (!simulation) return;
    await api.updateSimulationStatus(simulation.simulation_id, "Under Review");
    loadAudit();
    setSaveSuccessNotice(`Simulation ${simulation.simulation_id} submitted for Formal Finance Council Review.`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
    setIsReportModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
              Financial Modeling Sandbox
            </span>
            {isHistoricalMode && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                Historical Simulation
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Wand2 className="w-6 h-6 text-[#F59E0B]" />
            Metric Impact Simulator
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Model downstream ripple effects and blast radius before changing a governed business metric.
          </p>
        </div>

        {/* Global Controls & Status Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>SANDBOX</span>
          </span>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#0F172A] text-[#94A3B8] border border-[#334155]">
            READ ONLY
          </span>
          <StatusBadge status="verified" label="Production Data Unchanged" size="md" />
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessNotice && (
        <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* AI Simulation Prompt */}
      <AIAgentSimulationPrompt
        selectedMetricId={selectedMetricId}
        onApplyContract={handleApplyAiContract}
      />

      {/* Metric Selector */}
      <MetricSelector
        selectedMetricId={selectedMetricId}
        onSelectMetric={handleSelectMetric}
      />

      {/* Proposed Definition Editor */}
      <DefinitionEditor
        metric={metric}
        changeType={changeType}
        onChangeType={setChangeType}
        proposedFormula={proposedFormula}
        onFormulaChange={setProposedFormula}
        onRunSimulation={executeSimulation}
        isRunning={isRunning}
        onReset={handleReset}
      />

      {/* Governance Assertion Validation Gate */}
      {simulation && (
        <GovernanceValidation
          validation={simulation.validation}
          metricName={simulation.metric_name}
        />
      )}

      {/* Side-by-Side Before vs After Comparison */}
      {simulation && !simulation.validation.blocked && (
        <CurrentVsProposedCard simulation={simulation} />
      )}

      {/* Downstream Impact Summary */}
      {simulation && !simulation.validation.blocked && (
        <ImpactSummary
          assessment={simulation.impact_assessment}
          activeFilter={activeAssetCategory}
          onSelectCategory={(cat) => setActiveAssetCategory(cat)}
        />
      )}

      {/* Downstream Dependency Graph */}
      {simulation && !simulation.validation.blocked && (
        <DependencyGraph simulation={simulation} />
      )}

      {/* Sensitivity Heatmap */}
      {simulation && !simulation.validation.blocked && (
        <ImpactHeatmap simulation={simulation} />
      )}

      {/* Granular Downstream Assets */}
      {simulation && !simulation.validation.blocked && (
        <div className="space-y-6">
          <AffectedDashboards
            dashboards={simulation.affected_assets.filter((a) => a.type === "dashboard")}
          />
          <AffectedReports
            reports={simulation.affected_assets.filter((a) => a.type === "report")}
          />
          <DependentMetrics metrics={simulation.dependent_metrics} />
          <AffectedQueries
            queries={simulation.affected_assets.filter((a) => a.type === "query")}
          />
        </div>
      )}

      {/* Multi-Scenario Modeling */}
      {simulation && !simulation.validation.blocked && simulation.scenarios.length > 0 && (
        <ScenarioComparison
          scenarios={simulation.scenarios}
          metricUnit={simulation.unit}
        />
      )}

      {/* Approval Workflow Bar */}
      {simulation && !simulation.validation.blocked && (
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Simulation Complete — Review Ready
            </h4>
            <p className="text-xs text-[#94A3B8]">
              Simulation results stored under ID <code className="text-[#06B6D4] font-mono">{simulation.simulation_id}</code> in Draft state.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <SecondaryButton
              size="sm"
              icon={<BookmarkCheck className="w-3.5 h-3.5 text-[#06B6D4]" />}
              onClick={handleSaveSimulation}
            >
              Save Simulation
            </SecondaryButton>

            <SecondaryButton
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-[#8B5CF6]" />}
              onClick={() => setIsReportModalOpen(true)}
            >
              Export Report
            </SecondaryButton>

            <PrimaryButton
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={handleSubmitReview}
            >
              Submit for Review
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Audit Trail Table */}
      <SimulationAudit auditTrail={auditRecords} />

      {/* Report Export & Review Modal */}
      {simulation && (
        <ImpactReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          simulation={simulation}
          onSaveSimulation={handleSaveSimulation}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
};
