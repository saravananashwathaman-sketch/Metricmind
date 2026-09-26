"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Check,
  Copy,
  X,
  Printer,
  ShieldCheck,
  Send,
  BookmarkCheck,
  Share2
} from "lucide-react";
import { SimulationResult } from "@/types/impact";

interface ImpactReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: SimulationResult;
  onSaveSimulation: () => void;
  onSubmitReview: () => void;
}

export const ImpactReportModal: React.FC<ImpactReportModalProps> = ({
  isOpen,
  onClose,
  simulation,
  onSaveSimulation,
  onSubmitReview
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const text = `
METRICMIND — METRIC IMPACT SIMULATION REPORT
=============================================
Simulation ID: ${simulation.simulation_id}
Status: ${simulation.status} (Sandbox Read-Only)
Timestamp: ${simulation.created_at}
Initiated By: ${simulation.created_by}

METRIC METADATA
- Metric: ${simulation.metric_name} (${simulation.metric_id})
- Current Version: v${simulation.current_version}
- Target Version: ${simulation.proposed_version}

MATHEMATICAL DEFINITIONS
- Current Formula: ${simulation.current_definition.formula}
- Proposed Formula: ${simulation.proposed_definition.formula}

ANALYTICAL VALUES (Q3 2026 Europe)
- Current Baseline: ${simulation.current_value.toFixed(2)}${simulation.unit}
- Simulated Value:  ${simulation.simulated_value.toFixed(2)}${simulation.unit}
- Difference:       ${simulation.difference_pp > 0 ? "+" : ""}${simulation.difference_pp.toFixed(2)} pp

DOWNSTREAM IMPACT FOOTPRINT
- Total Affected Assets: ${simulation.impact_assessment.total_affected_assets}
- Dashboards Affected:   ${simulation.impact_assessment.dashboards_count}
- Reports Affected:      ${simulation.impact_assessment.reports_count}
- Queries Impacted:      ${simulation.impact_assessment.queries_count}
- Dependent Metrics:     ${simulation.impact_assessment.dependent_metrics_count}

GOVERNANCE INTEGRITY
- Validation Result:     ${simulation.validation.is_valid ? "PASSED" : "BLOCKED"}
- Semantic Protection:   ENFORCED (No Production Drift)
=============================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(simulation, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MetricMind_Impact_Report_${simulation.simulation_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Governance Impact Report — {simulation.simulation_id}
              </h3>
              <p className="text-xs text-slate-400">
                Official simulation summary document for Executive & Finance Council review.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Metric</span>
              <span className="text-xs font-bold text-slate-100">{simulation.metric_name}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Author</span>
              <span className="text-xs font-bold text-slate-100">{simulation.created_by}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Timestamp</span>
              <span className="text-xs font-mono text-slate-300">{new Date(simulation.created_at).toLocaleDateString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Audit State</span>
              <span className="text-xs font-bold text-sky-400">Simulation Only</span>
            </div>
          </div>

          {/* Formulas */}
          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2.5 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-sans font-bold block">Current Governed Definition:</span>
              <div className="text-emerald-300 mt-0.5">{simulation.current_definition.formula}</div>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-slate-500 uppercase text-[10px] font-sans font-bold block">Proposed Alteration:</span>
              <div className="text-sky-300 mt-0.5">{simulation.proposed_definition.formula}</div>
            </div>
          </div>

          {/* Numerical Delta */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Current</span>
              <span className="text-xl font-bold font-mono text-slate-200">
                {simulation.current_value.toFixed(2)}{simulation.unit}
              </span>
            </div>
            <div className="text-slate-600 font-mono text-lg">→</div>
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase block">Simulated</span>
              <span className="text-xl font-bold font-mono text-sky-300">
                {simulation.simulated_value.toFixed(2)}{simulation.unit}
              </span>
            </div>
            <div className="text-slate-600 font-mono text-lg">=</div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Variance</span>
              <span className="text-xl font-bold font-mono text-slate-100">
                {simulation.difference_pp > 0 ? `+${simulation.difference_pp.toFixed(2)}` : simulation.difference_pp.toFixed(2)} pp
              </span>
            </div>
          </div>

          {/* Affected Assets Summary */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200">Impacted Asset Breakdown</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-base font-bold font-mono text-sky-400">{simulation.impact_assessment.dashboards_count}</span>
                <span className="text-[10px] text-slate-400 block">Dashboards</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-base font-bold font-mono text-indigo-400">{simulation.impact_assessment.reports_count}</span>
                <span className="text-[10px] text-slate-400 block">Reports</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-base font-bold font-mono text-emerald-400">{simulation.impact_assessment.saved_insights_count}</span>
                <span className="text-[10px] text-slate-400 block">Saved Insights</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-base font-bold font-mono text-amber-400">{simulation.impact_assessment.queries_count}</span>
                <span className="text-[10px] text-slate-400 block">Queries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Section 22 Workflow Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Summary"}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadSuccess ? "Downloaded" : "Export JSON"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSaveSimulation}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Save Simulation</span>
            </button>

            <button
              onClick={onSubmitReview}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
