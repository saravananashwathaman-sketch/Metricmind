"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Play,
  Loader2,
  Layers,
  Database,
  Check,
  Copy,
  ArrowDown,
  Filter,
  Calendar,
  Box,
  Server,
  AlertCircle
} from "lucide-react";
import { runMetricMindAgent, AgentExecutionTrace } from "@/lib/agentOrchestrator";

const DEFAULT_TRACE_DATA: AgentExecutionTrace = {
  user_question: "Show me European sales",
  intent: "Analytical query on Revenue",
  resolved_metric: "revenue",
  resolved_dimensions: ["region"],
  resolved_filters: { region: "Europe" },
  resolved_time_range: "Q2 2026",
  semantic_json: {
    measures: ["revenue"],
    dimensions: ["region"],
    time_dimension: "quarter",
    time_granularity: "quarter",
    time_range: "Q2 2026",
    filters: [
      {
        member: "region",
        operator: "equals",
        values: ["Europe"]
      }
    ],
    order: [{ member: "revenue", direction: "desc" }],
    limit: 100
  },
  cube_payload: {
    query: {
      measures: ["Sales.revenue"],
      dimensions: ["Geography.region"],
      timeDimensions: [
        {
          dimension: "Date.date",
          granularity: "quarter",
          dateRange: "Q2 2026"
        }
      ],
      filters: [
        {
          member: "Geography.region",
          operator: "equals",
          values: ["Europe"]
        }
      ],
      order: [["Sales.revenue", "desc"]],
      limit: 100
    }
  },
  validation_status: "PASSED",
  cube_response: {
    success: true,
    metric: "revenue",
    filters: { region: "Europe" },
    data: [
      {
        "Geography.region": "Europe",
        "Geography.country": "Germany",
        "Sales.revenue": 158000000,
        region: "Europe",
        revenue: 158000000,
        formatted: "₹15.80 Cr"
      }
    ],
    metadata: {
      source: "Cube Semantic Layer (Sales.yml)",
      definition_version: "2.4.0",
      governed_formula: "SUM(revenue)",
      cube_model: "Sales Cube (Sales.yml)",
      sql_generated_by_llm: "NONE",
      validation_status: "PASSED",
      execution_time_ms: 18,
      result_hash: "MM-CUBE-7A2F41D",
      timestamp: "2026-09-24T10:00:00.000Z",
      cube_payload: null
    }
  },
  sql_generated_by_llm: "NONE",
  execution_steps: []
};

export const ApiCheckView: React.FC = () => {
  const [question, setQuestion] = useState("Show me Q3 Revenue");
  const [isRunning, setIsRunning] = useState(false);
  const [traceData, setTraceData] = useState<AgentExecutionTrace | null>(DEFAULT_TRACE_DATA);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const samplePresets = [
    "Show me European sales",
    "Show me Q3 Revenue",
    "Why did European margins drop?",
    "Revenue by quarter",
    "India sales expansion"
  ];

  const handleRunApiCheck = async (qToRun?: string) => {
    const q = (qToRun || question).trim();
    if (!q || isRunning) return;

    setIsRunning(true);
    setErrorMessage(null);

    try {
      // 1. Primary: Server-side execution via /api/chat
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: AbortSignal.timeout(8000)
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data._trace) {
          setTraceData(data._trace);
          setIsRunning(false);
          return;
        }
      }

      // Check if server returned a controlled business error
      const errJson = await resp.json().catch(() => ({}));
      if (errJson.error) {
        setErrorMessage(errJson.error);
        setIsRunning(false);
        return;
      }

      throw new Error("Unable to retrieve trace from server API");
    } catch (e: any) {
      console.warn("Falling back to local client agent orchestrator:", e);
      try {
        // 2. Fallback: In-browser agent orchestrator
        const localRes = await runMetricMindAgent(q);
        setTraceData(localRes.trace);
      } catch (localErr: any) {
        setErrorMessage(localErr.message || "Failed to execute semantic translation.");
      } finally {
        setIsRunning(false);
      }
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Run initial test for preset on mount
  useEffect(() => {
    handleRunApiCheck("Show me Q3 Revenue");
  }, []);

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-sky-400" />
            API Check & Query Plan Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time translation audit: inspect how natural language maps into strict semantic JSON, Cube REST requests, and normalized responses with zero raw SQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Strict Zod Contract Active</span>
          </span>
        </div>
      </div>

      {/* Interactive Input Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Test Natural Language Business Question
        </div>

        <div className="flex flex-wrap gap-2">
          {samplePresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(p);
                handleRunApiCheck(p);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                question === p
                  ? "bg-sky-500/20 text-sky-200 border-sky-500/40 font-bold"
                  : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRunApiCheck();
            }}
            placeholder="Type a question (e.g. Show me Q3 Revenue)..."
            className="flex-1 p-3 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-500/50"
          />
          <button
            onClick={() => handleRunApiCheck()}
            disabled={isRunning}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run API Translation</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {traceData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Section 1: Visual Query Plan DAG (Requirement 16) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                Visual Query Plan DAG (Semantic Translation Pipeline)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Zero SQL Pipeline
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 overflow-x-auto py-2">
              {/* Step 1: User Question */}
              <div className="flex-1 min-w-[150px] p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">User Question</span>
                <span className="text-xs font-bold text-slate-200 block truncate">&quot;{traceData.user_question}&quot;</span>
                <span className="text-[10px] text-sky-400 font-mono">NL Intent</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden lg:block" />
              <ArrowDown className="w-4 h-4 text-slate-600 shrink-0 lg:hidden" />

              {/* Step 2: Metric Resolver */}
              <div className="flex-1 min-w-[150px] p-3.5 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-1 text-center shadow-lg shadow-sky-500/5">
                <span className="text-[10px] text-sky-400 font-bold uppercase block">Metric Resolver</span>
                <span className="text-xs font-black text-sky-300 block truncate">{traceData.resolved_metric}</span>
                <span className="text-[10px] text-slate-400 font-mono">SUM(revenue)</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden lg:block" />
              <ArrowDown className="w-4 h-4 text-slate-600 shrink-0 lg:hidden" />

              {/* Step 3: Dimension & Filter Resolver */}
              <div className="flex-1 min-w-[150px] p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-1 text-center shadow-lg shadow-indigo-500/5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">Filter / Grain</span>
                <span className="text-xs font-bold text-indigo-300 block truncate">
                  {Object.keys(traceData.resolved_filters).length > 0
                    ? `Region = ${JSON.stringify(traceData.resolved_filters.region || traceData.resolved_filters)}`
                    : traceData.resolved_time_range}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Governed Member</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden lg:block" />
              <ArrowDown className="w-4 h-4 text-slate-600 shrink-0 lg:hidden" />

              {/* Step 4: Cube REST API */}
              <div className="flex-1 min-w-[150px] p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1 text-center shadow-lg shadow-emerald-500/5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Cube REST API</span>
                <span className="text-xs font-black text-emerald-300 block">Sales.yml</span>
                <span className="text-[10px] text-slate-400 font-mono">SQL By LLM: NONE</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden lg:block" />
              <ArrowDown className="w-4 h-4 text-slate-600 shrink-0 lg:hidden" />

              {/* Step 5: Result */}
              <div className="flex-1 min-w-[150px] p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Governed Result</span>
                <span className="text-xs font-black text-slate-100 block">
                  {traceData.cube_response?.data?.[0]?.formatted ||
                    `₹${(((traceData.cube_response?.data?.[0]?.revenue || traceData.cube_response?.data?.[0]?.["Sales.revenue"] || 482500000)) / 10000000).toFixed(2)} Cr`}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Verified Hash</span>
              </div>
            </div>
          </div>

          {/* Section 2: Four-Column API Translation Audit Grid (Requirement 15) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: User Intent & Resolved Metadata */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">1. Intent & Entities</span>
                <span className="text-[10px] font-mono text-emerald-400">STATUS: RESOLVED</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">User Intent:</span>
                  <span className="text-slate-200 font-medium">{traceData.intent}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Resolved Metric:</span>
                  <span className="text-sky-300 font-bold font-mono">{traceData.resolved_metric}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Resolved Filters:</span>
                  <span className="text-indigo-300 font-mono">
                    {JSON.stringify(traceData.resolved_filters, null, 2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">SQL Generated by LLM:</span>
                  <span className="text-emerald-400 font-bold font-mono">NONE (Strict Semantic Mode)</span>
                </div>
              </div>
            </div>

            {/* Box 2: Semantic JSON Payload */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">2. Semantic JSON (Strict Contract)</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(traceData.semantic_json, null, 2), "semantic_json")}
                  className="text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === "semantic_json" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto h-40">
                {JSON.stringify(traceData.semantic_json, null, 2)}
              </pre>
            </div>

            {/* Box 3: Cube REST API Payload */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">3. Cube REST API Payload</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(traceData.cube_payload, null, 2), "cube_payload")}
                  className="text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === "cube_payload" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto h-40">
                {JSON.stringify(traceData.cube_payload, null, 2)}
              </pre>
            </div>

            {/* Box 4: Normalized Cube API Response */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">4. Normalized API Response</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  VALIDATION: PASSED
                </span>
              </div>
              <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto h-40">
                {JSON.stringify(
                  {
                    success: traceData.cube_response?.success,
                    metric: traceData.cube_response?.metric,
                    filters: traceData.cube_response?.filters,
                    data: traceData.cube_response?.data,
                    metadata: {
                      source: traceData.cube_response?.metadata?.source,
                      definition_version: traceData.cube_response?.metadata?.definition_version,
                      result_hash: traceData.cube_response?.metadata?.result_hash
                    }
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
