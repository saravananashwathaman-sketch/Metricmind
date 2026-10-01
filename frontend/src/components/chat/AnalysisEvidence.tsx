"use client";

import React from "react";
import { FileText, CheckCircle2, ShieldCheck, Database, Layers, Hash } from "lucide-react";
import { AnalyticalEvidence, GovernedMetricInfo } from "@/types";

interface AnalysisEvidenceProps {
  primaryMetric: string;
  period: string;
  region: string;
  secondaryAnalysis: string;
  queryCount: number;
  semanticDefinition: string;
  governedSignature?: string;
  evidenceTable?: AnalyticalEvidence;
}

export const AnalysisEvidence: React.FC<AnalysisEvidenceProps> = ({
  primaryMetric,
  period,
  region,
  secondaryAnalysis,
  queryCount,
  semanticDefinition,
  governedSignature,
  evidenceTable
}) => {
  return (
    <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Analysis Evidence
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Traceable Verification</span>
      </div>

      {/* Grid of Evidence Points */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Primary Metric</span>
          <div className="text-slate-200 font-medium truncate">{primaryMetric}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Period</span>
          <div className="text-slate-200 font-medium truncate">{period}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Region</span>
          <div className="text-slate-200 font-medium truncate">{region}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Secondary Analysis</span>
          <div className="text-sky-300 font-medium truncate">{secondaryAnalysis}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Queries Executed</span>
          <div className="text-indigo-300 font-mono font-bold">{queryCount}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Semantic Definition</span>
          <div className="text-emerald-300 font-mono text-[11px] truncate">{semanticDefinition}</div>
        </div>
      </div>

      {governedSignature && (
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span>Cryptographic Signature:</span>
          <span className="font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            {governedSignature}
          </span>
        </div>
      )}
    </div>
  );
};
