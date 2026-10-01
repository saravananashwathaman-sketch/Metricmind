"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Loader2,
  FileCode,
  Layers,
  Database,
  Table,
  Check,
  Copy,
  Cpu,
  Clock,
  Terminal,
  Server
} from "lucide-react";

export const QueryExplorerView: React.FC = () => {
  const [question, setQuestion] = useState("Show revenue by region");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [activeTab, setActiveTab] = useState<"cube_json" | "sql_trace">("cube_json");

  const sampleQuestions = [
    "What is our total revenue?",
    "Show revenue by region.",
    "Show Q3 revenue.",
    "Compare Q3 revenue with Q2.",
    "What is the gross margin?",
    "Show gross margin by region.",
    "Why did European revenue decrease?",
    "Which region generated the highest revenue?",
    "Show employee happiness score." // Invalid test query to showcase firewall rejection!
  ];

  const handleRunQueryTrace = async (qToRun?: string) => {
    const q = (qToRun || question).trim();
    if (!q || isRunning) return;

    setIsRunning(true);
    setExecutionResult(null);

    try {
      const res = await fetch("/api/semantic-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      console.error("Semantic query failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Search className="w-6 h-6 text-sky-400" />
            Semantic Query Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual inspection trace: Watch natural language transform through Intent → Governed Metric → Cube Query JSON → Firewall → Cube API → PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Cube.dev Semantic Layer</span>
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Raw SQL from LLM</span>
          </span>
        </div>
      </div>

      {/* Governed Test Questions Quick Selection Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Section 14 & 18 Governed Test Queries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => {
            const isInvalidTest = q.includes("happiness");
            return (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(q);
                  handleRunQueryTrace(q);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all text-left ${
                  question === q
                    ? "bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm"
                    : isInvalidTest
                    ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                <span className="text-slate-500 mr-1.5 font-mono">#{idx + 1}</span>
                {q}
                {isInvalidTest && <span className="ml-1.5 text-[10px] text-rose-400 font-bold">(Firewall Test)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center p-2 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-sky-500/50 shadow-inner">
          <Search className="w-4 h-4 text-sky-400 ml-2 mr-3 shrink-0" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRunQueryTrace()}
            placeholder="Type any natural language business analytics question..."
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs focus:outline-none"
          />
        </div>
        <button
          onClick={() => handleRunQueryTrace()}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Trace Cube Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Execution Pipeline Trace */}
      {executionResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* If query was blocked by Hallucination Firewall */}
          {executionResult.blocked && (
            <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-800/80 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>AI Hallucination Firewall Intercepted Query</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {executionResult.error || "The requested metric is not available in the governed semantic layer."}
              </p>
              <div className="p-3 rounded-xl bg-black/50 border border-rose-900/50 text-[11px] font-mono text-rose-400 flex items-center justify-between">
                <span>PostgreSQL / Cube API Status: <strong>NOT CALLED</strong></span>
                <span>Enforcement: Zero Unrestricted SQL Gateway</span>
              </div>
            </div>
          )}

          {/* If query succeeded */}
          {!executionResult.blocked && (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-5">
              {/* Section 9 Target Flow: User Question -> Intent -> Metric -> Dimensions -> Filters -> Cube Query -> Validation -> Execution -> Result */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Governed Cube Execution Pipeline Trace
                </h3>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Cube Query Validated</span>
                </span>
              </div>

              {/* 8-Stage Architecture Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* 1. Detected Intent */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase">1. Detected Intent</span>
                  <div className="text-slate-100 font-bold truncate">{executionResult.detected_intent || "Revenue Analysis"}</div>
                  <p className="text-[10px] text-slate-400 truncate">&quot;{executionResult.question}&quot;</p>
                </div>

                {/* 2. Selected Metric */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">2. Selected Metric</span>
                  <div className="text-slate-100 font-bold truncate">
                    {executionResult.metric?.display_name || "Revenue"}
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 truncate">
                    {executionResult.cube_query?.measures?.[0] || "Sales.revenue"}
                  </div>
                </div>

                {/* 3. Dimensions & Filters */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">3. Dimensions & Filters</span>
                  <div className="text-slate-100 font-bold truncate">
                    {executionResult.dimensions && executionResult.dimensions.length > 0
                      ? executionResult.dimensions.join(", ")
                      : "Aggregated (Global)"}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Time: {executionResult.time_range || "Q2 2026"}
                  </div>
                </div>

                {/* 4. Validation & Execution */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">4. Execution & Source</span>
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cube Semantic Layer</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {executionResult.execution_time_ms}ms • {executionResult.rows?.length || 0} rows
                  </div>
                </div>
              </div>

              {/* Code Tabs: Cube Query JSON vs SQL Execution Transparency */}
              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("cube_json")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "cube_json"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        Governed Cube Query JSON
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("sql_trace")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "sql_trace"
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-sky-400" />
                        Semantic SQL Transparency
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const text =
                        activeTab === "cube_json"
                          ? JSON.stringify(executionResult.cube_query, null, 2)
                          : executionResult.generated_sql;
                      navigator.clipboard.writeText(text);
                      setCopiedQuery(true);
                      setTimeout(() => setCopiedQuery(false), 2000);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
                  >
                    {copiedQuery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedQuery ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {activeTab === "cube_json" ? (
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 mb-1.5">
                      // Sent to Cube REST API Endpoint: POST /cubejs-api/v1/load (Zero LLM SQL)
                    </div>
                    <pre className="p-3.5 rounded-xl bg-slate-950 text-indigo-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-900">
                      {JSON.stringify(executionResult.cube_query, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 mb-1.5">
                      // SQL generated & executed strictly by the semantic layer (PostgreSQL semantic_sales view)
                    </div>
                    <pre className="p-3.5 rounded-xl bg-slate-950 text-sky-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-900">
                      {executionResult.generated_sql}
                    </pre>
                  </div>
                )}
              </div>

              {/* Explainable AI Narrative */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-sky-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Explanation (Governed Evidence Only)
                </span>
                <p className="leading-relaxed text-slate-300">{executionResult.explanation}</p>
              </div>

              {/* Granular Returned Rows Table */}
              {executionResult.rows && executionResult.rows.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-indigo-400" />
                      PostgreSQL Governed Result Set
                    </span>
                    <span className="text-slate-500 font-mono">{executionResult.rows.length} Records</span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold">
                        <tr>
                          {Object.keys(executionResult.rows[0]).map((col) => (
                            <th key={col} className="px-3 py-2.5">
                              {col.replace(/^(Geography|Sales|Date|Orders)\./, "")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                        {executionResult.rows.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-slate-900">
                            {Object.values(row).map((val: any, cIdx: number) => (
                              <td key={cIdx} className="px-3 py-2 font-mono text-slate-200">
                                {typeof val === "number"
                                  ? val > 1000000
                                    ? `₹${(val / 10000000).toFixed(2)} Cr`
                                    : val.toLocaleString()
                                  : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
