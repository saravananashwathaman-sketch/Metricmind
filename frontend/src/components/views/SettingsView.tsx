"use client";

import React, { useState } from "react";
import {
  Settings,
  Server,
  Layers,
  Bot,
  Database,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface SettingsViewProps {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDemoMode,
  onToggleDemoMode
}) => {
  const [snowflakeHost, setSnowflakeHost] = useState("prod-analytics.eu-central-1.snowflakecomputing.com");
  const [snowflakeWarehouse, setSnowflakeWarehouse] = useState("PROD_ANALYTICS_WH");
  const [semanticLayerUrl, setSemanticLayerUrl] = useState("https://cube-cloud.metricmind.internal/cubejs-api/v1");
  const [llmProvider, setLlmProvider] = useState("mock_llama3");
  const [llmModel, setLlmModel] = useState("llama3-70b-instruct");
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  const handleTestConnection = (service: string) => {
    setTestSuccess(`Successfully verified connectivity with ${service}!`);
    setTimeout(() => setTestSuccess(null), 3500);
  };

  return (
    <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#334155] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#4F46E5]" />
            System Architecture & Connection Settings
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Configure enterprise warehouse connections, semantic layer integrations, and LLM orchestrator providers.
          </p>
        </div>

        {/* Runtime Mode Badge */}
        <div
          onClick={onToggleDemoMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
            isDemoMode
              ? "bg-[#F59E0B]/10 hover:bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
              : "bg-[#10B981]/10 hover:bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isDemoMode ? "DEMO MODE (Active)" : "PRODUCTION MODE"}</span>
        </div>
      </div>

      {testSuccess && (
        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{testSuccess}</span>
        </div>
      )}

      {/* Mode Toggle Switcher Card */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Runtime Operating Mode
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Switch between the self-contained zero-dependency DEMO dataset in INR (₹) and live production connectors.
            </p>
          </div>
          <button
            onClick={onToggleDemoMode}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isDemoMode
                ? "bg-[#F59E0B] hover:bg-[#d97706] text-[#020617]"
                : "bg-[#10B981] hover:bg-[#059669] text-[#020617]"
            }`}
          >
            Switch to {isDemoMode ? "Production Mode" : "Demo Mode"}
          </button>
        </div>
      </div>

      {/* 1. Snowflake Enterprise Data Warehouse */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#06B6D4]" />
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Snowflake Enterprise Data Warehouse
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Target analytical database where dbt marts and star schemas reside.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#94A3B8] font-semibold">Account Host / Identifier</label>
            <input
              type="text"
              value={snowflakeHost}
              onChange={(e) => setSnowflakeHost(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#020617] border border-[#334155] text-[#F8FAFC] font-mono text-xs focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[#94A3B8] font-semibold">Virtual Warehouse</label>
            <input
              type="text"
              value={snowflakeWarehouse}
              onChange={(e) => setSnowflakeWarehouse(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#020617] border border-[#334155] text-[#F8FAFC] font-mono text-xs focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleTestConnection("Snowflake Data Warehouse")}
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#020617] border border-[#334155] text-xs font-semibold text-[#F8FAFC] transition-colors cursor-pointer"
          >
            Test Snowflake Connection
          </button>
        </div>
      </div>

      {/* 2. Semantic Layer */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#4F46E5]" />
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Governed Semantic Layer Gateway
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Cube.dev or dbt Semantic Layer API serving pre-compiled dimensional definitions.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Synced
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="text-[#94A3B8] font-semibold">Semantic Layer API Endpoint</label>
          <input
            type="text"
            value={semanticLayerUrl}
            onChange={(e) => setSemanticLayerUrl(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#020617] border border-[#334155] text-[#F8FAFC] font-mono text-xs focus:outline-none focus:border-[#4F46E5]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleTestConnection("Cube / dbt Semantic Layer")}
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#020617] border border-[#334155] text-xs font-semibold text-[#F8FAFC] transition-colors cursor-pointer"
          >
            Sync Semantic Catalog
          </button>
        </div>
      </div>

      {/* 3. AI Agent & LLM Provider Configuration */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-[#06B6D4]" />
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Agentic LLM Orchestrator Provider
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Language model reasoning engine responsible for intent parsing and semantic query synthesis.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded border border-[#06B6D4]/20">
            Zero Direct SQL Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#94A3B8] font-semibold">LLM Engine</label>
            <select
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#020617] border border-[#334155] text-[#F8FAFC] text-xs focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value="mock_llama3">Llama 3 (Configurable / Governed Orchestrator)</option>
              <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
              <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
              <option value="gemini">Google Gemini 1.5 Pro</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[#94A3B8] font-semibold">Model Identifier</label>
            <input
              type="text"
              value={llmModel}
              onChange={(e) => setLlmModel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#020617] border border-[#334155] text-[#F8FAFC] font-mono text-xs focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleTestConnection("Agentic LLM Provider")}
            className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-semibold text-[#F8FAFC] transition-colors cursor-pointer"
          >
            Verify Agent Orchestrator
          </button>
        </div>
      </div>
    </div>
  );
};
