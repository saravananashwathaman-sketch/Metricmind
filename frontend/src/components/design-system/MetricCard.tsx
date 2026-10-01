"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Sparkline } from "@/components/charts/Sparkline";
import { StatusBadge } from "./StatusBadge";

interface MetricCardProps {
  name: string;
  value: string;
  changePct?: string;
  changeType?: "positive" | "negative" | "neutral";
  comparisonPeriod?: string;
  status?: string;
  formula?: string;
  sparklineData?: number[];
  onExplain?: () => void;
  onAnalyze?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  name,
  value,
  changePct,
  changeType = "positive",
  comparisonPeriod = "vs previous quarter",
  status,
  formula,
  sparklineData,
  onExplain,
  onAnalyze,
  className = "",
}) => {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  return (
    <div
      className={`rounded-2xl p-5 bg-[#1E293B] border border-[#334155] hover:border-[#475569] transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm group ${className}`}
    >
      {/* Top Header: Metric Name & Status */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          {name}
        </span>
        {status && (
          <StatusBadge status={status} size="sm" />
        )}
      </div>

      {/* Main KPI Row: Value, Change & Sparkline */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1.5">
          <div className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            {value}
          </div>
          {changePct && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
                  isPositive
                    ? "text-[#10B981] bg-[#10B981]/10"
                    : isNegative
                    ? "text-[#EF4444] bg-[#EF4444]/10"
                    : "text-[#94A3B8] bg-[#334155]/50"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : isNegative ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
                {changePct}
              </span>
              <span className="text-[11px] text-[#64748B] font-normal truncate">
                {comparisonPeriod}
              </span>
            </div>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="shrink-0 mb-1">
            <Sparkline
              data={sparklineData}
              color={isNegative ? "#EF4444" : "#4F46E5"}
              height="32px"
              width="80px"
            />
          </div>
        )}
      </div>

      {/* Footer: Formula & Action buttons */}
      {(formula || onExplain || onAnalyze) && (
        <div className="pt-3 border-t border-[#334155] flex items-center justify-between text-xs text-[#64748B]">
          {formula ? (
            <span className="truncate font-mono text-[11px] text-[#94A3B8] max-w-[150px] sm:max-w-[200px]" title={formula}>
              {formula}
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 shrink-0">
            {onExplain && (
              <button
                type="button"
                onClick={onExplain}
                className="text-[11px] text-[#06B6D4] hover:text-[#38bdf8] font-medium transition-colors cursor-pointer"
              >
                Explain
              </button>
            )}
            {onAnalyze && (
              <button
                type="button"
                onClick={onAnalyze}
                className="text-[11px] text-[#4F46E5] hover:text-[#6366F1] font-medium transition-colors cursor-pointer"
              >
                Analyze →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
