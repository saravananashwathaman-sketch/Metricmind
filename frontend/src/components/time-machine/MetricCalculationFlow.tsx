"use client";

import React from "react";
import { CalculationStep } from "@/types/timeMachine";
import { Calculator, ArrowRight, Minus, Equal, CheckCircle2 } from "lucide-react";

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
  formattedComponents = {},
}) => {
  const steps = calculationFlow || [];
  const comp = formattedComponents || {};

  return (
    <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#06B6D4]" />
          <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
            Calculation Flow
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#10B981] bg-[#0F172A] px-2 py-0.5 rounded border border-[#334155]">
          Deterministic Verified
        </span>
      </div>

      {/* Visual Component Flow: Revenue - Cost = Gross Profit → Gross Margin */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 rounded-xl bg-[#0F172A] border border-[#334155]">
        {/* Revenue */}
        <div className="flex flex-col items-center p-3 rounded-lg bg-[#1E293B] border border-[#334155] min-w-[110px]">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Revenue</span>
          <span className="text-base sm:text-lg font-bold text-[#F8FAFC] mt-0.5 font-mono">
            {comp.revenue || "₹48.60 Cr"}
          </span>
          <span className="text-[10px] text-[#94A3B8]">Recognized</span>
        </div>

        {/* Minus */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#334155] shrink-0">
          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>

        {/* Cost */}
        <div className="flex flex-col items-center p-3 rounded-lg bg-[#1E293B] border border-[#334155] min-w-[110px]">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Cost</span>
          <span className="text-base sm:text-lg font-bold text-[#EF4444] mt-0.5 font-mono">
            {comp.cost || "₹35.38 Cr"}
          </span>
          <span className="text-[10px] text-[#94A3B8]">Governed COGS</span>
        </div>

        {/* Equal */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#334155] shrink-0">
          <Equal className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>

        {/* Gross Profit */}
        <div className="flex flex-col items-center p-3 rounded-lg bg-[#1E293B] border border-[#334155] min-w-[120px]">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Gross Profit</span>
          <span className="text-base sm:text-lg font-bold text-[#06B6D4] mt-0.5 font-mono">
            {comp.gross_profit || "₹13.22 Cr"}
          </span>
          <span className="text-[10px] text-[#94A3B8]">Retained Margin</span>
        </div>

        {/* Arrow to Final Percentage */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#334155] shrink-0">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Gross Margin (Final Value) */}
        <div className="flex flex-col items-center p-3.5 rounded-lg bg-[#1E293B] border border-[#4F46E5] min-w-[130px] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#818CF8] tracking-wider">
            {metricName}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-0.5 font-mono">
            {finalValue}
          </span>
          <span className="text-[10px] text-[#10B981] font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Governed Result
          </span>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
          Calculation Pipeline
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step) => (
            <div
              key={step.step_number}
              className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1.5 text-xs hover:border-[#475569] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#06B6D4] font-mono">
                  STEP {step.step_number}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1E293B] text-[#94A3B8] font-mono border border-[#334155]">
                  {step.result_name}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#020617] border border-[#334155] font-mono text-[11px] text-[#F8FAFC]">
                {step.operation}
              </div>
              <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
                <span>Result:</span>
                <span className="font-bold text-[#F8FAFC] font-mono">{step.result_val}</span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-tight">
                {step.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
