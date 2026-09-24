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
  Copy
} from "lucide-react";

interface QueryTraceStep {
  step: string;
  detail: string;
  status: "done" | "in_progress" | "pending";
}

export const QueryExplorerView: React.FC = () => {
  const [question, setQuestion] = useState("Why did European margins change?");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const sampleQuestions = [
    "What is our total revenue?",
    "What was our revenue last quarter?",
    "Why did European margins change?",
    "Which region generated the highest revenue?",
    "Which products have the highest margin?",
    "What are our top 5 customers by revenue?",
    "Compare revenue between Europe and Asia.",
    "Show monthly revenue for 2026.",
    "Which category has the lowest margin?",
    "What is our gross profit?"
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
            Visual inspection trace: Watch natural language transform through Intent → Governed Metric → SQL Validation → PostgreSQL semantic_sales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Raw SQL • Read-Only Enforced</span>
          </span>
        </div>
      </div>

      {/* 10 Test Questions Quick Selection Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>10 Tested Governed Questions (Section 23 Verification Suite):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(q);
                handleRunQueryTrace(q);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all text-left ${
                question === q
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              <span className="text-slate-500 mr-1.5 font-mono">#{idx + 1}</span>
              {q}
            </button>
          ))}
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
              <span>Trace Query Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Execution Pipeline Trace */}
      {executionResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Step-by-Step Flow Graphic */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Governed Execution Pipeline Trace
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-sky-400 uppercase">1. Intent Extraction</span>
                <div className="text-slate-100 font-bold">{executionResult.detected_intent}</div>
                <p className="text-[10px] text-slate-400 truncate">&quot;{executionResult.question}&quot;</p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">2. Governed Metric</span>
                <div className="text-slate-100 font-bold">{executionResult.metric?.display_name || "Revenue"}</div>
                <div className="text-[10px] font-mono text-sky-300 truncate">{executionResult.metric?.formula_sql}</div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">3. Governance Validation</span>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{executionResult.validation_result}</span>
                </div>
                <div className="text-[10px] text-slate-400">Target: semantic_sales view</div>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">4. PostgreSQL Execution</span>
                <div className="text-slate-100 font-bold font-mono">{executionResult.execution_time_ms}ms</div>
                <div className="text-[10px] text-slate-400">{executionResult.rows?.length || 0} rows retrieved</div>
              </div>
            </div>

            {/* Generated SQL Code Block */}
            <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span className="flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Read-Only SQL Query (semantic_sales)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(executionResult.generated_sql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? "Copied" : "Copy SQL"}</span>
                </button>
              </div>
              <code className="block p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                {executionResult.generated_sql}
              </code>
            </div>

            {/* Explanation Narrative */}
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase">Explainable AI Narrative</span>
              <p className="leading-relaxed">{executionResult.explanation}</p>
            </div>

            {/* Granular Returned Rows Table */}
            {executionResult.rows && executionResult.rows.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>PostgreSQL Result Set</span>
                  <span className="text-slate-500">{executionResult.rows.length} Records</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold">
                      <tr>
                        {Object.keys(executionResult.rows[0]).map((col) => (
                          <th key={col} className="px-3 py-2.5">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                      {executionResult.rows.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-900">
                          {Object.values(row).map((val: any, cIdx: number) => (
                            <td key={cIdx} className="px-3 py-2 font-mono text-slate-200">
                              {typeof val === "number" ? val.toLocaleString() : String(val)}
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
        </div>
      )}
    </div>
  );
};
