"use client";

import React, { useState } from "react";
import { Database, ShieldCheck, Check, Copy, User, Calendar, Tag } from "lucide-react";

interface MetricVersionCardProps {
  name: string;
  version: string;
  formula: string;
  description: string;
  owner: string;
  status: string;
  effectiveFrom: string;
}

export const MetricVersionCard: React.FC<MetricVersionCardProps> = ({
  name,
  version,
  formula,
  description,
  owner,
  status,
  effectiveFrom
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Semantic Layer Metric Definition
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold">
            Version {version}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {status}
          </span>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Metric Name</span>
          <span className="font-bold text-slate-100 mt-0.5 block truncate">{name}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Owner</span>
          <span className="font-bold text-slate-100 mt-0.5 block truncate flex items-center gap-1">
            <User className="w-3 h-3 text-indigo-400 shrink-0" />
            {owner}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Effective From</span>
          <span className="font-bold text-slate-100 mt-0.5 block truncate flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
            {effectiveFrom}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Governance Layer</span>
          <span className="font-bold text-sky-300 mt-0.5 block truncate flex items-center gap-1">
            <Tag className="w-3 h-3 text-sky-400 shrink-0" />
            Cube Semantic Layer
          </span>
        </div>
      </div>

      {/* Governed Formula Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Governed Formula (Zero LLM SQL Hallucination):</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/20 font-mono text-xs sm:text-sm text-sky-300 overflow-x-auto shadow-inner">
          {formula}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/70">
        <span className="font-bold text-slate-200">Semantic Definition: </span>
        {description}
      </p>
    </div>
  );
};
