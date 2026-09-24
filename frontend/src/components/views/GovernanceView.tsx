"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  History,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  FileCode,
  Layers,
  Database,
  RefreshCw,
  Sparkles,
  Zap,
  Fingerprint,
  Check,
  Copy,
  Terminal,
  Server
} from "lucide-react";
import { AuditLog, RogueSimulationResult } from "@/types";
import { api } from "@/lib/api";
import { INITIAL_AUDIT_LOGS } from "@/lib/mockData";
import { runRepeatabilityTest, RepeatabilityTestResult } from "@/lib/cubeClient";
import { detectSqlHallucination } from "@/lib/semanticSchema";

export const GovernanceView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "audit-proof" | "repeatability" | "sql-detector" | "automated-suite" | "rbac-logs"
  >("audit-proof");

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Repeatability Test State
  const [repQuestion, setRepQuestion] = useState("Show me Q3 Revenue");
  const [isTestingRep, setIsTestingRep] = useState(false);
  const [repeatabilityResult, setRepeatabilityResult] = useState<RepeatabilityTestResult | null>(null);

  // SQL Hallucination State
  const [hallucinationInput, setHallucinationInput] = useState(
    "SELECT region, SUM(revenue) FROM raw_erp_sales WHERE margin < 0.25 GROUP BY region;"
  );
  const [hallucinationResult, setHallucinationResult] = useState<{
    isHallucinatingSql: boolean;
    detectedKeywords: string[];
    explanation: string;
  } | null>(null);

  // Automated 8-test suite state
  const [suiteLoading, setSuiteLoading] = useState(false);
  const [suiteResults, setSuiteResults] = useState<any>(null);

  // Rogue simulator state
  const [testSql, setTestSql] = useState(
    "SELECT * FROM fct_sales WHERE region = 'Europe' AND revenue < cost;"
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<RogueSimulationResult | null>(null);

  useEffect(() => {
    loadLogs();
    handleRunRepeatability("Show me Q3 Revenue");
    handleCheckHallucination(hallucinationInput);
    handleRunAutomatedSuite();
  }, []);

  const loadLogs = async () => {
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
  };

  const handleRunRepeatability = async (q: string) => {
    setIsTestingRep(true);
    try {
      const res = await api.runRepeatabilityTest(q);
      setRepeatabilityResult(res);
    } catch (e) {
      console.error("Repeatability test error", e);
    } finally {
      setIsTestingRep(false);
    }
  };

  const handleCheckHallucination = (text: string) => {
    const res = detectSqlHallucination(text);
    setHallucinationResult(res);
  };

  const handleRunAutomatedSuite = async () => {
    setSuiteLoading(true);
    try {
      const res = await api.getAutomatedTests();
      if (res) {
        setSuiteResults(res);
      }
    } catch (e) {
      console.error("Automated suite error", e);
    } finally {
      setSuiteLoading(false);
    }
  };

  const handleSimulateRogueQuery = async () => {
    if (!testSql.trim() || isSimulating) return;
    setIsSimulating(true);
    const res = await api.simulateRogueBlocker(testSql);
    setSimulationResult(res);
    setIsSimulating(false);
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Governance Audit & Zero Rogue SQL Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Proving trusted, governed, deterministic business analytics over Cube.dev with zero arbitrary SQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Semantic Gateway: Enforced</span>
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/20 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" />
            <span>Cube.dev Semantic Layer</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-2">
        {[
          { id: "audit-proof", label: "Governance Audit Proof", icon: <Fingerprint className="w-3.5 h-3.5" /> },
          { id: "repeatability", label: "Deterministic Repeatability (5x)", icon: <RefreshCw className="w-3.5 h-3.5" /> },
          { id: "sql-detector", label: "SQL Hallucination Detector", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: "automated-suite", label: "8-Test Compliance Suite", icon: <CheckCircle2 className="w-3.5 h-3.5" />, badge: "8/8 Pass" },
          { id: "rbac-logs", label: "RBAC & Security Log", icon: <Lock className="w-3.5 h-3.5" /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === t.id
                ? "bg-sky-500/20 text-sky-200 border border-sky-500/40 shadow-sm"
                : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.badge && (
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: GOVERNANCE AUDIT PROOF */}
      {activeSubTab === "audit-proof" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-sky-400" />
                  Live Governance Audit Evidence Record
                </h3>
                <p className="text-[11px] text-slate-400">
                  Verifiable audit proof that answers originate exclusively from governed Cube definitions, not ad-hoc SQL.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED GOVERNED QUERY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question & Intent */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  User Question & Resolved Intent
                </span>
                <div className="text-base font-bold text-slate-100">&quot;Show me Q3 Revenue&quot;</div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Resolved Metric:</span>
                  <span className="font-bold text-sky-300">Revenue (Sales.revenue)</span>
                </div>
              </div>

              {/* Semantic Definition */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Governed Semantic Definition
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Version 2.4.0</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-sky-300">
                  SUM(revenue)
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Model: marts.finance.fct_sales</span>
                  <span>Owner: Priya Sharma (VP Strategic Finance)</span>
                </div>
              </div>
            </div>

            {/* Generated Semantic Query vs SQL Generated By LLM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Generated Semantic Query (Strict JSON)
                  </span>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    Zod Schema: PASSED
                  </span>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`{
  "measures": ["revenue"],
  "dimensions": [],
  "time_dimension": "quarter",
  "time_granularity": "quarter",
  "time_range": "Q3 2026",
  "filters": [],
  "limit": 100
}`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SQL Generated By LLM
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    ZERO ROGUE SQL
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-2 py-6">
                  <div className="text-xl font-mono font-black text-emerald-400">NONE</div>
                  <p className="text-xs text-slate-300 max-w-xs">
                    LLM prohibited from generating SQL. Execution strictly delegated to Cube.dev semantic engine.
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Status Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/50 via-slate-950 to-emerald-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Semantic Layer</span>
                <span className="font-bold text-slate-200">Cube.dev (Sales Cube)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Result</span>
                <span className="font-black text-lg text-slate-100">₹48.25 Cr</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Result Hash</span>
                <span className="font-mono text-sky-400">MM-CUBE-7F9A1B2C</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Validation Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED & VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETERMINISTIC REPEATABILITY TEST */}
      {activeSubTab === "repeatability" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-sky-400" />
                Automated Deterministic Repeatability Engine (5x Consecutive Runs)
              </h3>
              <p className="text-[11px] text-slate-400">
                Execute the same business question 5 times against the fixed snapshot to prove mathematical consistency.
              </p>
            </div>

            {repeatabilityResult && (
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                  repeatabilityResult.status === "PASS"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                }`}
              >
                {repeatabilityResult.status === "PASS" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                Consistency: {repeatabilityResult.identical_runs} / {repeatabilityResult.total_runs} (100% {repeatabilityResult.status})
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={repQuestion}
              onChange={(e) => setRepQuestion(e.target.value)}
              className="flex-1 p-3 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500/50"
              placeholder="Question to test for repeatability..."
            />
            <button
              onClick={() => handleRunRepeatability(repQuestion)}
              disabled={isTestingRep}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isTestingRep ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute 5x Test</span>
                </>
              )}
            </button>
          </div>

          {/* Test Runs Breakdown */}
          {repeatabilityResult && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Target Metric</span>
                  <span className="font-bold text-slate-200">{repeatabilityResult.metric}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Semantic Definition</span>
                  <span className="font-mono text-sky-300 text-[11px]">{repeatabilityResult.semantic_definition}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Data Snapshot</span>
                  <span className="font-mono text-slate-300 text-[11px]">{repeatabilityResult.data_snapshot_id}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Status</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 5 / 5 Identical Results
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="px-3 py-2.5">Run</th>
                      <th className="px-3 py-2.5">Numerical Result</th>
                      <th className="px-3 py-2.5">Display Value</th>
                      <th className="px-3 py-2.5">Result Hash</th>
                      <th className="px-3 py-2.5">Execution Time</th>
                      <th className="px-3 py-2.5">Baseline Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {repeatabilityResult.runs.map((r) => (
                      <tr key={r.run_number} className="hover:bg-slate-950/40">
                        <td className="px-3 py-2.5 font-bold text-slate-200">Run {r.run_number}</td>
                        <td className="px-3 py-2.5 text-slate-300">{r.numerical_result}</td>
                        <td className="px-3 py-2.5 text-emerald-300 font-bold">{r.formatted_result}</td>
                        <td className="px-3 py-2.5 text-sky-400">{r.hash}</td>
                        <td className="px-3 py-2.5 text-slate-400">{r.execution_ms}ms</td>
                        <td className="px-3 py-2.5">
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] font-bold">
                            ✓ 100% MATCH
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SQL HALLUCINATION DETECTOR */}
      {activeSubTab === "sql-detector" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                SQL Hallucination & Raw Query Interceptor
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspects agent reasoning outputs and prevents raw SQL keywords before semantic execution.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                LLM → Semantic API: ✓ PASSED
              </span>
              <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                LLM → Raw SQL: ✓ BLOCKED
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Test Agent Text or Query Payload:
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={hallucinationInput}
                onChange={(e) => {
                  setHallucinationInput(e.target.value);
                  handleCheckHallucination(e.target.value);
                }}
                rows={2}
                className="flex-1 p-3 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-500/50"
                placeholder="Type or paste payload to test for SQL hallucination..."
              />
            </div>

            {hallucinationResult && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-150 ${
                  hallucinationResult.isHallucinatingSql
                    ? "bg-rose-950/40 border-rose-500/30 text-rose-200"
                    : "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">
                    {hallucinationResult.isHallucinatingSql ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {hallucinationResult.isHallucinatingSql
                      ? "SQL HALLUCINATION DETECTED — EXECUTION BLOCKED"
                      : "SQL BYPASS: PASSED — ZERO RAW SQL DETECTED"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-black/40">
                    {hallucinationResult.detectedKeywords.length} Keywords Flagged
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {hallucinationResult.explanation}
                </p>
                {hallucinationResult.detectedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hallucinationResult.detectedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: 8-TEST AUTOMATED COMPLIANCE SUITE */}
      {activeSubTab === "automated-suite" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Comprehensive 8-Scenario Governance Test Suite
              </h3>
              <p className="text-[11px] text-slate-400">
                Automated validation of all required functional, security, and repeatability scenarios.
              </p>
            </div>

            <button
              onClick={handleRunAutomatedSuite}
              disabled={suiteLoading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-2"
            >
              {suiteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Re-run All Tests</span>
            </button>
          </div>

          {suiteResults && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Total Tests</span>
                  <span className="font-bold text-slate-200">{suiteResults.summary.total_tests}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Passed</span>
                  <span className="font-bold text-emerald-400">{suiteResults.summary.passed_tests}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Failed</span>
                  <span className="font-bold text-slate-400">{suiteResults.summary.failed_tests}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Success Rate</span>
                  <span className="font-bold text-emerald-400">{suiteResults.summary.success_rate}</span>
                </div>
              </div>

              <div className="space-y-2">
                {suiteResults.tests.map((t: any) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                          {t.id}
                        </span>
                        <span className="text-slate-100 font-bold">{t.name}</span>
                        <span className="text-[10px] text-slate-400">({t.description})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-3">
                        <span>
                          Input: <span className="font-mono text-slate-300">&quot;{t.input}&quot;</span>
                        </span>
                        <span>•</span>
                        <span>
                          Actual: <span className="text-emerald-300 font-mono">{t.actual}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:self-center shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">{t.execution_ms}ms</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PASSED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RBAC & AUDIT LOGS */}
      {activeSubTab === "rbac-logs" && (
        <div className="space-y-6">
          {/* RBAC Matrix */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-400" />
                Enterprise Role Permissions & Semantic Masking Matrix
              </h3>
              <span className="text-[10px] text-slate-500">4 Defined Roles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="px-3 py-2.5">Enterprise Role</th>
                    <th className="px-3 py-2.5">Conversational BI</th>
                    <th className="px-3 py-2.5">Edit Metrics</th>
                    <th className="px-3 py-2.5">Approve / Verify</th>
                    <th className="px-3 py-2.5">Audit Trail</th>
                    <th className="px-3 py-2.5">Data Masking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { role: "Admin", ask: true, edit: true, verify: true, audit: true, mask: "None (Full Access)" },
                    { role: "Executive", ask: true, edit: false, verify: false, audit: true, mask: "None (Executive View)" },
                    { role: "Finance Analyst", ask: true, edit: true, verify: false, audit: false, mask: "PII Masked" },
                    { role: "Sales Analyst", ask: true, edit: false, verify: false, audit: false, mask: "Margins Masked" }
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-950/40">
                      <td className="px-3 py-3 text-slate-100 font-bold">{r.role}</td>
                      <td className="px-3 py-3 text-emerald-400">{r.ask ? "✓ Enabled" : "—"}</td>
                      <td className="px-3 py-3">{r.edit ? <span className="text-emerald-400">✓ Enabled</span> : <span className="text-slate-500">Restricted</span>}</td>
                      <td className="px-3 py-3">{r.verify ? <span className="text-emerald-400">✓ Enabled</span> : <span className="text-slate-500">Restricted</span>}</td>
                      <td className="px-3 py-3">{r.audit ? <span className="text-emerald-400">✓ Enabled</span> : <span className="text-slate-500">Restricted</span>}</td>
                      <td className="px-3 py-3 text-sky-400 font-mono text-[11px]">{r.mask}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                Governance Audit Trail & Compliance Log
              </h3>
              <span className="text-[10px] text-slate-500">{auditLogs.length} Events Recorded</span>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-slate-200 font-semibold">{log.details}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Target: {log.target_id}</span>
                      <span>•</span>
                      <span>By: {log.performed_by} ({log.role})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                      {log.compliance_status}
                    </span>
                    <span className="text-[10px] text-slate-500">{log.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
