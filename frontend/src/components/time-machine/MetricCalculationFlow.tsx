"use client";

import React from "react";
import { CalculationStep } from "@/types/timeMachine";
import { Calculator, ArrowRight, Minus, Divide, Percent, Equal, Sparkles, CheckCircle2 } from "lucide-react";

interface MetricCalculationFlowProps {
  calculationFlow: CalculationStep[];
  metricName: string;
  finalValue: string;
  formattedComponents: Record<string, string>;
}

export const MetricCalculationFlow: React.FC<MetricCalculationFlowProps> = ({
  calculationFlow = [],
  metricName = "Gross Margin",
  finalValue = "27.2%",
  formattedComponents = {}
}) => {
  const steps = calculationFlow || [];
  const comp = formattedComponents || {};

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Deterministic Number Reconstruction Flow
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
          Zero LLM Estimation
        </span>
      </div>

      {/* Visual Component Cards Bridge (e.g. Revenue - Cost = Gross Profit) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
        {/* Revenue */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 min-w-[110px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Revenue</span>
          <span className="text-base sm:text-lg font-black text-sky-400 mt-1">
            {comp.revenue || "₹48.60 Cr"}
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">Top-Line</span>
        </div>

        {/* Minus Operator Pill */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-rose-400 border border-slate-700 shadow-sm shrink-0">
          <Minus className="w-3.5 h-3.5 stroke-[3]" />
        </div>

        {/* Cost */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 min-w-[110px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cost</span>
          <span className="text-base sm:text-lg font-black text-rose-400 mt-1">
            {comp.cost || "₹35.38 Cr"}
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">Governed COGS</span>
        </div>

        {/* Equal Operator Pill */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shadow-sm shrink-0">
          <Equal className="w-3.5 h-3.5 stroke-[3]" />
        </div>

        {/* Gross Profit */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/30 min-w-[120px]">
          <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Gross Profit</span>
          <span className="text-base sm:text-lg font-black text-indigo-200 mt-1">
            {comp.gross_profit || "₹13.22 Cr"}
          </span>
          <span className="text-[9px] text-indigo-400/80 mt-0.5">Retained Earnings</span>
        </div>

        {/* Arrow to percentage calculation */}
        <div className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Final Result Card */}
        <div className="flex flex-col items-center p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-sky-950/30 to-slate-900 border border-emerald-500/40 min-w-[130px] shadow-lg shadow-emerald-500/10">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>{metricName}</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-300 mt-1 tracking-tight">
            {finalValue}
          </span>
          <span className="text-[9px] text-emerald-400/80 mt-0.5 font-medium">Reconstructed Number</span>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Sequential Calculation Pipeline:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step) => (

            <div
              key={step.step_number}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs relative overflow-hidden group hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-400 font-mono">
                  STEP 0{step.step_number}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  {step.result_name}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/90 font-mono text-[11px] text-slate-200">
                {step.operation}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Result:</span>
                <span className="font-bold text-slate-100 font-mono">{step.result_val}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {step.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
