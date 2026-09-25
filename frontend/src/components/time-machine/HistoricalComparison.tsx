"use client";

import React, { useState } from "react";
import {
  Clock,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Layers,
  Filter,
  Database,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { TimeMachineCompareResponse } from "@/types/timeMachine";

interface HistoricalComparisonProps {
  currentValue: number;
  currentFormatted: string;
  previousValue?: number;
  previousFormatted?: string;
  differencePp?: number;
  comparisonData?: TimeMachineCompareResponse;
  onRunMomentComparison?: (periodA: string, periodB: string) => void;
}

export const HistoricalComparison: React.FC<HistoricalComparisonProps> = ({
  currentValue = 27.2,
  currentFormatted = "27.2%",
  previousValue = 29.1,
  previousFormatted = "29.1%",
  differencePp = -1.9,
  comparisonData,
  onRunMomentComparison
}) => {
  const [showCounterfactual, setShowCounterfactual] = useState(false);
  const [selectedPeriodA, setSelectedPeriodA] = useState("Q3 2026");
  const [selectedPeriodB, setSelectedPeriodB] = useState("Q3 2025");
  const [normalizeCurrent, setNormalizeCurrent] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. "WHAT WOULD THE OLD FORMULA HAVE SHOWN?" (Section 8) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              What Would The Old Formula Have Shown?
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Counterfactual Evaluation
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Evaluate today&apos;s data snapshot through the historical formula lens to isolate the exact numerical impact of the semantic definition upgrade.
        </p>

        {!showCounterfactual ? (
          <button
            onClick={() => setShowCounterfactual(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95 group"
          >
            <Clock className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
            <span>Compare With Previous Definition</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 3 Metric Cards: CURRENT, PREVIOUS, DEFINITION IMPACT */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CURRENT */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  CURRENT (v2.1)
                </span>
                <div className="text-2xl font-black text-slate-100 font-mono">
                  {currentFormatted}
                </div>
                <div className="text-[10px] text-slate-400">Current Ratified Formula</div>
              </div>

              {/* PREVIOUS */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  PREVIOUS (v1.0/v2.0)
                </span>
                <div className="text-2xl font-black text-slate-200 font-mono">
                  {previousFormatted}
                </div>
                <div className="text-[10px] text-slate-400">Prior Baseline Formula</div>
              </div>

              {/* DEFINITION IMPACT */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">
                  DEFINITION IMPACT
                </span>
                <div className="text-2xl font-black text-rose-300 font-mono flex items-center gap-1">
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                  {differencePp > 0 ? `+${differencePp}` : differencePp} pp
                </div>
                <div className="text-[10px] text-rose-400/90">Pure Logic Change Effect</div>
              </div>
            </div>

            {/* Crucial Governance Guardrail Callout */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Strict Audit Notice: Historical Comparison Only.</span>
                <p className="text-[11px] text-amber-300/90 mt-0.5">
                  The previous definition result ({previousFormatted}) is a mathematical counterfactual for auditing logic shifts. It must not be cited as the current financial performance of the business.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. COMPARE TWO POINTS IN TIME (Section 20 & 21) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Compare Two Moments (Time Travel)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Period Selectors */}
            <select
              value={selectedPeriodA}
              onChange={(e) => {
                setSelectedPeriodA(e.target.value);
                if (onRunMomentComparison) onRunMomentComparison(e.target.value, selectedPeriodB);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q1 2026">Q1 2026</option>
            </select>
            <span className="text-xs text-slate-400 font-bold">vs</span>
            <select
              value={selectedPeriodB}
              onChange={(e) => {
                setSelectedPeriodB(e.target.value);
                if (onRunMomentComparison) onRunMomentComparison(selectedPeriodA, e.target.value);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Q3 2025">Q3 2025</option>
              <option value="Q4 2025">Q4 2025</option>
              <option value="Q1 2026">Q1 2026</option>
            </select>
          </div>
        </div>

        {/* Comparison Values Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {selectedPeriodA} (Current Period)
            </span>
            <div className="text-xl font-black text-sky-400 font-mono">27.2%</div>
            <div className="text-[10px] text-slate-400">Version 2.1</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {selectedPeriodB} (Historical Period)
            </span>
            <div className="text-xl font-black text-slate-200 font-mono">31.4%</div>
            <div className="text-[10px] text-slate-400">Version 1.8 / 1.0</div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-300">
              Total Reported Delta
            </span>
            <div className="text-xl font-black text-rose-300 font-mono">-4.2 pp</div>
            <div className="text-[10px] text-rose-400/80">31.4% → 27.2%</div>
          </div>
        </div>

        {/* DEFINITION-AWARE WARNING (Section 21) */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>⚠ DEFINITION CHANGED BETWEEN PERIODS</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-amber-500/20">
            <div>
              <span className="text-slate-400 text-[10px] block">{selectedPeriodB}:</span>
              Metric Version 1.8
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">{selectedPeriodA}:</span>
              Metric Version 2.1
            </div>
          </div>
          <p className="text-[11px] text-amber-200/90">
            <span className="font-semibold">Direct comparison may be affected by a metric-definition change. </span>
            Do NOT automatically attribute the entire -4.2 pp change solely to business operational performance.
          </p>
        </div>

        {/* 3 Decomposition Dimensions: Definition Difference vs Data Difference vs Filter Difference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Definition Difference */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>1. Definition Difference</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Formula in 2026 subtracts line-haul logistics freight & carrier adjustments (-1.9 pp).
            </p>
          </div>

          {/* Data Difference */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-sky-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>2. Data Difference</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              18,492 sales rows evaluated in {selectedPeriodA} vs 14,210 rows in {selectedPeriodB} (+30% volume expansion).
            </p>
          </div>

          {/* Filter Difference */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Filter Difference</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Both queries constrained to Region = Europe, Status = Completed. Same partition boundary.
            </p>
          </div>
        </div>

        {/* Normalization Toggle */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNormalizeCurrent(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !normalizeCurrent
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              Compare Using Historical Definitions
            </button>
            <button
              onClick={() => setNormalizeCurrent(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                normalizeCurrent
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              <RefreshCw className="w-3 h-3 text-emerald-400" />
              <span>Normalize Using Current Definition</span>
            </button>
          </div>

          {normalizeCurrent && (
            <div className="text-xs text-emerald-400 font-mono">
              Normalized Operational Change: <span className="font-bold">-2.3 pp</span> (excluding -1.9 pp definition effect)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
