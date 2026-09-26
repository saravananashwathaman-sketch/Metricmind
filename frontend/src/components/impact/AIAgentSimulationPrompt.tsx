"use client";

import React, { useState } from "react";
import { Sparkles, Send, Code, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { parseNaturalLanguageToContract } from "@/lib/impactSimulator";
import { StrictSimulationContract } from "@/types/impact";

interface AIAgentSimulationPromptProps {
  selectedMetricId: string;
  onApplyContract: (contract: StrictSimulationContract) => void;
}

export const AIAgentSimulationPrompt: React.FC<AIAgentSimulationPromptProps> = ({
  selectedMetricId,
  onApplyContract
}) => {
  const [prompt, setPrompt] = useState("");
  const [generatedContract, setGeneratedContract] = useState<StrictSimulationContract | null>(null);
  const [showJson, setShowJson] = useState(false);

  const samplePrompts = [
    "What happens if we include logistics costs in gross margin?",
    "Simulate gross margin with ASC 606 adjusted cost for Europe",
    "What if we exclude cancelled orders from revenue recognition?",
    "Include freight surcharges in Q3 2026 gross margin"
  ];

  const handleInterpret = (textToUse?: string) => {
    const q = textToUse || prompt;
    if (!q.trim()) return;

    try {
      const contract = parseNaturalLanguageToContract(q, selectedMetricId);
      setGeneratedContract(contract);
      setShowJson(true);
    } catch (e) {
      console.error("Failed to parse natural language simulation request", e);
    }
  };

  const handleConfirmApply = () => {
    if (generatedContract) {
      onApplyContract(generatedContract);
      setShowJson(false);
      setGeneratedContract(null);
      setPrompt("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-950/30 via-slate-900 to-indigo-950/30 border border-sky-500/30 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              Section 19 & 20
            </span>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              AI Agent Metric Interpreter & Strict JSON Generator
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Describe your proposed business change in natural language. The agent converts it into a validated Zod JSON contract without directly touching production data.
          </p>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="e.g. What happens if we include logistics costs in gross margin?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInterpret()}
            className="w-full px-4 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
        <button
          onClick={() => handleInterpret()}
          disabled={!prompt.trim()}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 disabled:opacity-40"
        >
          <span>Interpret</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sample Prompt Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Suggested:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(p);
              handleInterpret(p);
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Strict JSON Contract Preview Modal/Card (Section 20) */}
      {showJson && generatedContract && (
        <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/40 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              Strict Zod JSON Contract (Validated)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Schema Verified
            </span>
          </div>

          <pre className="p-3 rounded-lg bg-black/80 border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-48">
            {JSON.stringify(generatedContract, null, 2)}
          </pre>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setShowJson(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmApply}
              className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <span>Load into Simulation Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
