"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Terminal,
  Database,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Layers,
  Sparkles,
  Zap
} from "lucide-react";
import { ApiCallInfo, SqlExecutionInfo, AnalyticalEvidence } from "@/types";
import { ApiCallViewer } from "./ApiCallViewer";
import { SqlViewer } from "./SqlViewer";

interface TransparencyPanelProps {
  question: string;
  resolvedIntent?: string;
  semanticJson?: any;
  apiCall?: ApiCallInfo;
  sqlInfo?: SqlExecutionInfo;
  evidence?: AnalyticalEvidence;
  normalizedData?: any;
  initialTab?: "semantic" | "api" | "sql" | "response";
}

export const TransparencyPanel: React.FC<TransparencyPanelProps> = ({
  question,
  resolvedIntent,
  semanticJson,
  apiCall,
  sqlInfo,
  evidence,
  normalizedData,
  initialTab = "api"
}) => {
  const [activeTab, setActiveTab] = useState<"semantic" | "api" | "sql" | "response">(initialTab);
  const [copied, setCopied] = useState(false);

  const semanticJsonString = JSON.stringify(semanticJson || {}, null, 2);
  const responseDataString = JSON.stringify(normalizedData || evidence?.rows || {}, null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden space-y-4 p-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Query Transparency & Governance Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
          <ShieldCheck className="w-3 h-3" />
          <span>Firewall & Governance Verified</span>
        </div>
      </div>

      {/* Visual Pipeline Breadcrumbs */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/70 overflow-x-auto">
        <div className="flex items-center gap-2 text-[10px] font-medium min-w-max text-slate-400">
          <span className="text-sky-300 font-semibold">User Question</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300">Resolved Intent</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-indigo-300">Semantic JSON</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-300">Firewall Validation</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-300">Cube API Request</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300">SQL / Provider</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-sky-300 font-semibold">Normalized Result</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800/80">
        <button
          onClick={() => setActiveTab("semantic")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "semantic"
              ? "bg-sky-500/20 text-sky-300 shadow-sm border border-sky-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Semantic JSON</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "api"
              ? "bg-sky-500/20 text-sky-300 shadow-sm border border-sky-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>API Call</span>
        </button>

        <button
          onClick={() => setActiveTab("sql")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "sql"
              ? "bg-sky-500/20 text-sky-300 shadow-sm border border-sky-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>SQL</span>
        </button>

        <button
          onClick={() => setActiveTab("response")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "response"
              ? "bg-sky-500/20 text-sky-300 shadow-sm border border-sky-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Response</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "semantic" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Governed Semantic Payload Contract (Zero Rogue SQL)</span>
            <button
              onClick={() => handleCopy(semanticJsonString)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-300"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-2xl bg-black/70 border border-slate-800 text-sky-300 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
            {semanticJsonString}
          </pre>
        </div>
      )}

      {activeTab === "api" && <ApiCallViewer apiCall={apiCall} />}

      {activeTab === "sql" && <SqlViewer sqlInfo={sqlInfo} />}

      {activeTab === "response" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Normalized JSON Result Records</span>
            <button
              onClick={() => handleCopy(responseDataString)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-300"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-2xl bg-black/70 border border-slate-800 text-indigo-300 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
            {responseDataString}
          </pre>
        </div>
      )}
    </div>
  );
};
