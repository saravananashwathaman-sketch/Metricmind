"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Layers, CheckCircle2, Zap } from "lucide-react";

export const AnalyticsVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/10 via-indigo-600/10 to-emerald-600/5 rounded-3xl blur-2xl pointer-events-none" />

      {/* SVG Connecting Flow Lines */}
      <div className="relative rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md p-6 overflow-hidden shadow-2xl">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        {/* Top Header of the Visual Box */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Governed Semantic Flow
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono text-sky-400">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            <span>Zero Rogue SQL</span>
          </div>
        </div>

        {/* Interactive / Animated Node Diagram */}
        <div className="relative grid grid-cols-2 gap-4 z-10">
          {/* Node 1: Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition-colors shadow-sm relative group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                Gross Revenue
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 font-semibold border border-sky-500/20">
                +12.4%
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100 tracking-tight">₹48.6 Cr</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
              SUM(fct_sales.revenue)
            </div>
          </motion.div>

          {/* Node 2: COGS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-colors shadow-sm relative group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Direct Costs (COGS)
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                Verified
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100 tracking-tight">₹32.8 Cr</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
              marts.finance.fct_sales
            </div>
          </motion.div>

          {/* Center Connector Bar */}
          <div className="col-span-2 flex items-center justify-center my-[-2px] relative z-20">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-400 shadow-md">
              <Layers className="w-3 h-3 text-sky-400" />
              <span>Semantic Aggregation &amp; Lineage</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
            </div>
          </div>

          {/* Node 3: Gross Margin (Centerpiece) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-sky-950/30 border border-sky-500/30 hover:border-sky-500/60 transition-colors shadow-lg relative group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-sky-300 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-sky-400" />
                Gross Margin %
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Governed
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100 tracking-tight">32.5%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              ((Revenue - Cost) / Revenue) * 100
            </div>
          </motion.div>

          {/* Node 4: Operating Profit & Churn */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-colors shadow-sm relative group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Operating Profit
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                +9.8% QoQ
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100 tracking-tight">₹15.8 Cr</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
              Churn: 1.2% (Governed Baseline)
            </div>
          </motion.div>
        </div>

        {/* Bottom Status Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Agentic Semantic Resolution</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-medium">
            295ms • 100% Deterministic
          </span>
        </div>
      </div>
    </div>
  );
};
