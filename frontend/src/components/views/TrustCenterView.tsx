"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  History,
  GitFork,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Check,
  Server,
  Database,
  FileCheck
} from "lucide-react";
import { APPROVED_MEASURES } from "@/lib/semanticSchema";

interface MetricVersionHistory {
  metric_name: string;
  version: string;
  previous_version: string;
  formula: string;
  previous_formula: string;
  updated_at: string;
  owner: string;
  change_reason: string;
}

export const TrustCenterView: React.FC = () => {
  const [stats, setStats] = useState({
    semantic_metrics_count: 24,
    verified_metrics_count: 21,
    draft_metrics_count: 3,
    raw_sql_queries_from_llm: 0,
    governance_tests_count: 42,
    governance_tests_passed: 42,
    governance_tests_failed: 0,
    semantic_api_success_rate: "99.8%",
    deterministic_query_tests: "100%"
  });

  const versionHistory: MetricVersionHistory[] = [
    {
      metric_name: "Gross Margin",
      version: "3.0.1",
      previous_version: "3.0.0",
      formula: "((Revenue - Cost) / Revenue) * 100",
      previous_formula: "(Revenue - Cost) / Revenue",
      updated_at: "2026-09-18",
      owner: "Priya Sharma (VP Strategic Finance)",
      change_reason: "Standardized percentage scaling factor across global reporting dashboards"
    },
    {
      metric_name: "Gross Revenue",
      version: "2.4.0",
      previous_version: "2.3.1",
      formula: "SUM(revenue)",
      previous_formula: "SUM(invoiced_amount)",
      updated_at: "2026-09-15",
      owner: "Priya Sharma (VP Strategic Finance)",
      change_reason: "Integrated ASC 606 revenue recognition criteria for deferred subscriptions"
    },
    {
      metric_name: "Cost of Goods Sold (COGS)",
      version: "2.1.0",
      previous_version: "2.0.0",
      formula: "SUM(cost)",
      previous_formula: "SUM(direct_costs)",
      updated_at: "2026-09-12",
      owner: "Anand Verma (Director Financial Ops)",
      change_reason: "Incorporated tiered cloud hosting bandwidth allocations into unit COGS"
    },
    {
      metric_name: "Average Order Value (AOV)",
      version: "1.5.0",
      previous_version: "1.4.0",
      formula: "Revenue / Order Count",
      previous_formula: "Gross Billings / Orders",
      updated_at: "2026-08-30",
      owner: "Rohan Mehta (Lead Data Engineer)",
      change_reason: "Aligned denominator strictly with verified enterprise fulfilled order IDs"
    }
  ];

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            MetricMind Enterprise Trust Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Governed semantic assurance: Zero hallucinations, deterministic mathematical repeatability, and formal cryptographic lineage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliance Grade: SOC2 / FinGov-Ready</span>
          </span>
        </div>
      </div>

      {/* Trust Metrics Scorecard (Requirement 17) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Governed Semantic Metrics
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">{stats.semantic_metrics_count}</span>
            <span className="text-xs text-emerald-400 font-bold font-mono">
              ({stats.verified_metrics_count} Verified, {stats.draft_metrics_count} Draft)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">Single source of business truth</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-1 shadow-emerald-500/5">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
            Raw SQL Queries From LLM
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{stats.raw_sql_queries_from_llm}</span>
            <span className="text-xs text-emerald-300 font-bold font-mono">ZERO ROGUE SQL</span>
          </div>
          <span className="text-[10px] text-slate-400 block">LLM prohibited from generating SQL</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Automated Governance Tests
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-400">{stats.governance_tests_count}</span>
            <span className="text-xs text-emerald-400 font-bold font-mono">
              ({stats.governance_tests_passed} Passed / {stats.governance_tests_failed} Failed)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">100% test pass rate</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Deterministic Repeatability
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-400">{stats.deterministic_query_tests}</span>
            <span className="text-xs text-indigo-300 font-mono">API: {stats.semantic_api_success_rate}</span>
          </div>
          <span className="text-[10px] text-slate-500 block">5/5 identical runs on data snapshot</span>
        </div>
      </div>

      {/* 5 Core Trust Pillars */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          The 5 Pillars of MetricMind Deterministic Governance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          {[
            {
              title: "1. No Text-to-SQL",
              desc: "Zero arbitrary SQL generated by LLMs. Semantic queries are structured selections over pre-compiled schemas.",
              color: "text-emerald-400",
              border: "border-emerald-500/20"
            },
            {
              title: "2. Single Source of Truth",
              desc: "Formulas like Gross Margin are defined once in Cube models and verified by finance owners.",
              color: "text-sky-400",
              border: "border-sky-500/20"
            },
            {
              title: "3. Strict JSON Contracts",
              desc: "AI agent responses must conform to Zod/Pydantic schemas with whitelist validation before execution.",
              color: "text-indigo-400",
              border: "border-indigo-500/20"
            },
            {
              title: "4. Deterministic Repeatability",
              desc: "The same business question run against identical data snapshots produces identical mathematical results.",
              color: "text-purple-400",
              border: "border-purple-500/20"
            },
            {
              title: "5. Cryptographic Audit",
              desc: "Every query execution records metric version, source lineage, execution hash, and RBAC authorization.",
              color: "text-amber-400",
              border: "border-amber-500/20"
            }
          ].map((p, idx) => (
            <div key={idx} className={`p-4 rounded-2xl bg-slate-950/70 border ${p.border} space-y-1.5`}>
              <span className={`text-xs font-bold ${p.color} block`}>{p.title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Metric Versioning & Audit History (Requirement 18) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              Governed Metric Versioning & Evolution Audit Trail
            </h3>
            <p className="text-[11px] text-slate-400">
              Complete change log showing previous vs new formulas, timestamps, authorized owners, and business rationale.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-xl">
            Immutable Audit History
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-3 py-2.5">Metric</th>
                <th className="px-3 py-2.5">Version</th>
                <th className="px-3 py-2.5">Governed Formula</th>
                <th className="px-3 py-2.5">Previous Formula</th>
                <th className="px-3 py-2.5">Authorized Owner</th>
                <th className="px-3 py-2.5">Change Rationale</th>
                <th className="px-3 py-2.5">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {versionHistory.map((vh, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40">
                  <td className="px-3 py-3 font-bold text-slate-100">{vh.metric_name}</td>
                  <td className="px-3 py-3 font-mono text-emerald-400">
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                      v{vh.version}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-sky-300 text-[11px]">{vh.formula}</td>
                  <td className="px-3 py-3 font-mono text-slate-500 text-[11px] line-through">
                    {vh.previous_formula}
                  </td>
                  <td className="px-3 py-3 text-slate-300">{vh.owner}</td>
                  <td className="px-3 py-3 text-slate-400 text-[11px] max-w-xs">{vh.change_reason}</td>
                  <td className="px-3 py-3 text-slate-500 font-mono text-[10px]">{vh.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
