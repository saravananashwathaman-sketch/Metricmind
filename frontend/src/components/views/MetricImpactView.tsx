"use client";

import React, { useState, useEffect } from "react";
import {
  Wand2,
  Sliders,
  Database,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  History,
  Info,
  Clock,
  Send,
  Download,
  BookmarkCheck,
  RefreshCw,
  Eye,
  Check
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

import {
  ChangeType,
  SimulationResult,
  StrictSimulationContract,
  SimulationAuditRecord
} from "@/types/impact";
import {
  IMPACT_METRICS_CATALOG,
  runMetricSimulation,
  getAuditTrail,
  updateAuditStatus
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
  onNavigateTab
}) => {
  // State
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

  // Load initial simulation on mount
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
      // Deterministic simulation
      const res = await api.simulateMetricImpact({
        metric: selectedMetricId,
        change_type: changeType,
        formula: proposedFormula,
        user_name: userRole === "Admin" ? "Priya Sharma" : "Rajesh Kapoor"
      });

      if (res.simulation) {
        setSimulation(res.simulation);
      } else {
        // Direct engine fallback
        const localSim = runMetricSimulation(
          selectedMetricId,
          proposedFormula,
          changeType,
          { region: "Europe", period: "Q3 2026" },
          userRole === "Admin" ? "Priya Sharma" : "Rajesh Kapoor"
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
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      {/* 1. Header (Section 5 & 39) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Wand2 className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                  Metric Impact Simulator
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Predictive BI
                </span>
                {isHistoricalMode && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    HISTORICAL SIMULATION
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand the downstream impact before changing a governed business metric.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Status Badges */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[11px]">DEMO MODE (MOCK LAYER)</span>
          </span>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Sandbox Boundary: Enforced</span>
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* 2. AI Natural Language Prompt Bar (Section 19 & 20) */}
      <AIAgentSimulationPrompt
        selectedMetricId={selectedMetricId}
        onApplyContract={handleApplyAiContract}
      />

      {/* 3. Metric Selector (Section 3) */}
      <MetricSelector
        selectedMetricId={selectedMetricId}
        onSelectMetric={handleSelectMetric}
      />

      {/* 4. Proposed Definition Editor (Section 4 & 5) */}
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

      {/* 5. Governance Assertion Validation Gate (Section 18) */}
      {simulation && (
        <GovernanceValidation
          validation={simulation.validation}
          metricName={simulation.metric_name}
        />
      )}

      {/* 6. Before vs After Value Comparison (Section 6 & 14) */}
      {simulation && !simulation.validation.blocked && (
        <CurrentVsProposedCard simulation={simulation} />
      )}

      {/* 7. Downstream Impact Summary (Section 8 & 9) */}
      {simulation && !simulation.validation.blocked && (
        <ImpactSummary
          assessment={simulation.impact_assessment}
          activeFilter={activeAssetCategory}
          onSelectCategory={(cat) => setActiveAssetCategory(cat)}
        />
      )}

      {/* 8. Interactive Downstream Dependency Graph (Section 7 & 32) */}
      {simulation && !simulation.validation.blocked && (
        <DependencyGraph simulation={simulation} />
      )}

      {/* 9. Sensitivity Heatmap (Section 33) */}
      {simulation && !simulation.validation.blocked && (
        <ImpactHeatmap simulation={simulation} />
      )}

      {/* 10. Granular Downstream Asset Cards */}
      {simulation && !simulation.validation.blocked && (
        <div className="space-y-6">
          {/* Affected Dashboards (Section 11) */}
          <AffectedDashboards
            dashboards={simulation.affected_assets.filter((a) => a.type === "dashboard")}
          />

          {/* Affected Reports (Section 12) */}
          <AffectedReports
            reports={simulation.affected_assets.filter((a) => a.type === "report")}
          />

          {/* Dependent Derived Metrics (Section 10) */}
          <DependentMetrics metrics={simulation.dependent_metrics} />

          {/* Affected Saved Queries (Section 13) */}
          <AffectedQueries
            queries={simulation.affected_assets.filter((a) => a.type === "query")}
          />
        </div>
      )}

      {/* 11. What-If Multi-Scenario Modeling (Section 16 & 17) */}
      {simulation && !simulation.validation.blocked && simulation.scenarios.length > 0 && (
        <ScenarioComparison
          scenarios={simulation.scenarios}
          metricUnit={simulation.unit}
        />
      )}

      {/* 12. Approval Workflow Bar (Section 22) */}
      {simulation && !simulation.validation.blocked && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              Section 22 • Approval & Export Workflow
            </span>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Simulation Complete — Review Ready
            </h4>
            <p className="text-xs text-slate-400">
              Simulation results are stored under ID <code className="text-sky-300 font-mono">{simulation.simulation_id}</code> in Draft state.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSaveSimulation}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Save Simulation</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Impact Report</span>
            </button>

            <button
              onClick={handleSubmitReview}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>
      )}

      {/* 13. Audit Trail Table (Section 23) */}
      <SimulationAudit auditTrail={auditRecords} />

      {/* 14. Report Export & Review Modal (Section 22 & 24) */}
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
