"use client";

import React from "react";
import { Zap, Check, ShieldCheck, Cpu, LineChart, Lock } from "lucide-react";
import { AnalyticsVisual } from "./AnalyticsVisual";

export const BrandPanel: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between h-full p-8 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Branding Header */}
      <div className="relative z-10 space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 shadow-xl shadow-sky-500/20 text-white shrink-0">
            <Zap className="w-6 h-6 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-slate-100 uppercase">
                METRICMIND
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded-full tracking-wide">
                ENTERPRISE BI
              </span>
            </div>
            <p className="text-xs text-slate-400">Agentic Semantic BI Engine</p>
          </div>
        </div>

        {/* Heading & Tagline */}
        <div className="space-y-3 pt-4 max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Trusted Intelligence. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              Governed Decisions.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Transform natural-language business questions into explainable, governed analytics.
          </p>
          <p className="text-xs text-slate-400 font-mono">
            &ldquo;Ask business questions. Get governed answers.&rdquo;
          </p>
        </div>

        {/* Three Key Feature Highlights */}
        <div className="pt-2 space-y-2.5 max-w-md">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-xs">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200">Governed Semantic Layer</span>
              <p className="text-[11px] text-slate-400">
                Single source of metric truth with dbt and Cube semantic contracts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-xs">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-500/15 text-sky-400 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200">Agentic Business Intelligence</span>
              <p className="text-[11px] text-slate-400">
                Autonomous 12-step analytical reasoning without rogue SQL hallucinations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-xs">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200">Explainable Analytics</span>
              <p className="text-[11px] text-slate-400">
                Full cryptographic audit lineage, driver breakdowns, and verification signatures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle/Bottom: Subtle Abstract Analytics Visualization */}
      <div className="relative z-10 py-6 my-auto hidden md:block">
        <AnalyticsVisual />
      </div>

      {/* Bottom Compliance & Security Assurance */}
      <div className="relative z-10 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Trust Semantic Gateway</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-slate-400">ISO/SOC2 Aligned</span>
          <span>•</span>
          <span className="text-slate-400">Role-Based Access</span>
        </div>
      </div>
    </div>
  );
};
