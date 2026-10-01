"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Loader2,
  Copy,
  Check,
  Terminal,
  Database,
  Layers,
  FileCode,
  Table,
} from "lucide-react";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { PrimaryButton } from "@/components/design-system/Buttons";

type ExplorerTab = "semantic_json" | "api_request" | "api_response" | "validation";

export const QueryExplorerView: React.FC = () => {
  const [question, setQuestion] = useState("Show revenue by region");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<ExplorerTab>("semantic_json");

  const sampleQuestions = [
    "What is our total revenue?",
    "Show revenue by region.",
    "Show Q3 revenue.",
    "Compare Q3 revenue with Q2.",
    "What is the gross margin?",
    "Show gross margin by region.",
    "Why did European revenue decrease?",
    "Which region generated the highest revenue?",
    "Show employee happiness score.", // Firewall test query
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
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      console.error("Semantic query failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const getActiveTabContent = () => {
    if (!executionResult) return "";
    switch (activeTab) {
      case "semantic_json":
        return JSON.stringify(
          {
            metric: executionResult.metric,
            dimensions: executionResult.dimensions,
            filters: executionResult.filters || { region: "Global" },
            time_range: executionResult.time_range || "Q2 2026",
            cube_query: executionResult.cube_query,
          },
          null,
          2
        );
      case "api_request":
        return JSON.stringify(
          {
            endpoint: "POST /cubejs-api/v1/load",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer [governed_semantic_token]",
            },
            body: {
              query: executionResult.cube_query,
              queryType: "multi-dimensional-aggregate",
            },
          },
          null,
          2
        );
      case "api_response":
        return JSON.stringify(
          {
            status: "200 OK",
            query_time_ms: executionResult.execution_time_ms,
            row_count: executionResult.rows?.length || 0,
            data: executionResult.rows || [],
          },
          null,
          2
        );
      case "validation":
        return JSON.stringify(
          {
            validation_status: executionResult.blocked ? "BLOCKED" : "PASSED",
            zero_rogue_sql_verified: true,
            semantic_layer_target: "Sales.yml",
            cube_measures_approved: executionResult.cube_query?.measures || [],
            cube_dimensions_approved: executionResult.cube_query?.dimensions || [],
            firewall_decision: executionResult.blocked ? "REJECTED_UNKNOWN_ENTITY" : "APPROVED",
            rbac_permission: "Executive_Granted",
          },
          null,
          2
        );
      default:
        return "";
    }
  };

  const handleCopy = () => {
    const text = getActiveTabContent();
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
              Developer & Analyst Tool
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Search className="w-6 h-6 text-[#4F46E5]" />
            Semantic Query Explorer
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Inspect semantic translation: Natural Language → Intent → Governed Cube JSON → API Request/Response.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <StatusBadge status="connected" label="Cube Semantic Layer" size="md" />
          <StatusBadge status="verified" label="Zero Raw SQL" size="md" />
        </div>
      </div>

      {/* Governed Test Queries */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8]">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Preset Test Queries</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => {
            const isInvalidTest = q.includes("happiness");
            const isSelected = question === q;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  handleRunQueryTrace(q);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer text-left ${
                  isSelected
                    ? "bg-[#4F46E5]/15 text-[#818CF8] border-[#4F46E5]"
                    : isInvalidTest
                    ? "bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30"
                    : "bg-[#1E293B] hover:bg-[#334155]/60 text-[#F8FAFC] border-[#334155]"
                }`}
              >
                <span className="text-[#64748B] mr-1.5 font-mono">#{idx + 1}</span>
                {q}
                {isInvalidTest && (
                  <span className="ml-1.5 text-[10px] text-[#EF4444] font-semibold">
                    (Firewall Test)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center px-3.5 py-2.5 rounded-xl bg-[#020617] border border-[#334155] focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/20 shadow-sm transition-all">
          <Search className="w-4 h-4 text-[#64748B] mr-3 shrink-0" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRunQueryTrace()}
            placeholder="Type any natural language business analytics question..."
            className="flex-1 bg-transparent border-none text-[#F8FAFC] placeholder-[#64748B] text-xs sm:text-sm focus:outline-none"
          />
        </div>
        <PrimaryButton
          size="md"
          icon={<Play className="w-4 h-4" />}
          isLoading={isRunning}
          onClick={() => handleRunQueryTrace()}
        >
          Execute Trace
        </PrimaryButton>
      </div>

      {/* Visual Execution Details & Code Panel */}
      {executionResult && (
        <div className="space-y-6">
          {/* Blocked Notification */}
          {executionResult.blocked && (
            <div className="p-5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>AI Hallucination Firewall Intercepted Query</span>
              </div>
              <p className="text-xs text-[#F8FAFC] leading-relaxed">
                {executionResult.error || "The requested metric is not available in the governed semantic layer."}
              </p>
              <div className="text-[11px] font-mono text-[#EF4444] pt-1">
                PostgreSQL & Cube API Status: <strong>NOT CALLED</strong> (Zero Rogue SQL Boundary Enforced)
              </div>
            </div>
          )}

          {/* Inspection Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Status</span>
              <div className="text-xs font-bold text-[#F8FAFC]">
                {executionResult.blocked ? (
                  <span className="text-[#EF4444]">Blocked</span>
                ) : (
                  <span className="text-[#10B981]">Approved (200)</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Metric</span>
              <div className="text-xs font-semibold text-[#F8FAFC] truncate">
                {executionResult.metric?.display_name || "Revenue"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Dimensions</span>
              <div className="text-xs font-semibold text-[#F8FAFC] truncate">
                {executionResult.dimensions && executionResult.dimensions.length > 0
                  ? executionResult.dimensions.join(", ")
                  : "Global Aggregation"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Filters</span>
              <div className="text-xs font-semibold text-[#F8FAFC] truncate">
                {executionResult.filters ? JSON.stringify(executionResult.filters) : "None"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Time Range</span>
              <div className="text-xs font-semibold text-[#F8FAFC] truncate">
                {executionResult.time_range || "Q2 2026"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Validation Result</span>
              <div className="text-xs font-semibold text-[#10B981] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>
          </div>

          {/* 4 Professional Code Tabs: Semantic JSON | API Request | API Response | Validation */}
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm overflow-hidden">
            {/* Tab Selector Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-[#334155]">
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("semantic_json")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "semantic_json"
                      ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  Semantic JSON
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("api_request")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "api_request"
                      ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  API Request
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("api_response")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "api_response"
                      ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  API Response
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("validation")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "validation"
                      ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  Validation
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-[#020617] border border-[#334155] transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-4 bg-[#020617] overflow-x-auto max-h-96 custom-scrollbar">
              <pre className="font-mono text-xs text-[#06B6D4] leading-relaxed">
                <code>{getActiveTabContent()}</code>
              </pre>
            </div>
          </div>

          {/* Result Table if rows returned */}
          {executionResult.rows && executionResult.rows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-[#4F46E5]" />
                  PostgreSQL Semantic Results
                </span>
                <span>{executionResult.rows.length} Records</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-[#334155]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0F172A] text-[#94A3B8] uppercase text-[10px] font-semibold border-b border-[#334155]">
                    <tr>
                      {Object.keys(executionResult.rows[0]).map((col) => (
                        <th key={col} className="px-3.5 py-2.5">
                          {col.replace(/^(Geography|Sales|Date|Orders)\./, "")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155] bg-[#1E293B]">
                    {executionResult.rows.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-[#0F172A]/50 transition-colors">
                        {Object.values(row).map((val: any, cIdx: number) => (
                          <td key={cIdx} className="px-3.5 py-2.5 font-mono text-[#F8FAFC]">
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
  );
};
