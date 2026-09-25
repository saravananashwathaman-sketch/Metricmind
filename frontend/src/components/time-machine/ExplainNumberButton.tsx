"use client";

import React from "react";
import { History, Sparkles, Clock } from "lucide-react";

interface ExplainNumberButtonProps {
  onClick: (e?: React.MouseEvent) => void;
  metricName?: string;
  metricId?: string;
  period?: string;
  region?: string;
  variant?: "pill" | "compact" | "badge" | "outline" | "inline";
  className?: string;
}

export const ExplainNumberButton: React.FC<ExplainNumberButtonProps> = ({
  onClick,
  metricName,
  variant = "pill",
  className = ""
}) => {
  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        type="button"
        title={`Explain this number with Time Machine${metricName ? ` (${metricName})` : ""}`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/20 text-[11px] font-semibold transition-all group shrink-0 ${className}`}
      >
        <History className="w-3 h-3 group-hover:rotate-[-30deg] transition-transform text-sky-400" />
        <span>Explain Number</span>
      </button>
    );
  }

  if (variant === "badge") {
    return (
      <button
        onClick={onClick}
        type="button"
        title="Reconstruct how this value was calculated"
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-emerald-500/15 hover:from-sky-500/25 hover:to-indigo-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold shadow-sm transition-all group ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
        <span>Explain This Number</span>
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium text-xs hover:underline decoration-sky-400/50 underline-offset-2 transition-colors ${className}`}
      >
        <History className="w-3 h-3" />
        <span>Explain This Number</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-sky-500/20 text-slate-300 hover:text-sky-200 border border-slate-700/70 hover:border-sky-500/40 text-xs font-medium transition-all shadow-sm group active:scale-95 ${className}`}
    >
      <History className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-[-45deg] transition-transform" />
      <span>Explain This Number</span>
    </button>
  );
};
