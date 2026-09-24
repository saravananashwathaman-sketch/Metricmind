"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  Database,
  ArrowRight,
  GitFork,
  ShieldAlert,
  X
} from "lucide-react";
import { NavTab } from "./Sidebar";
import { GOVERNED_METRIC_CATALOG } from "@/lib/mockData";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onAskQuestion: (q: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onAskQuestion
}) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const suggestedQuestions = [
    "Why did our European margins drop last quarter?",
    "What was our revenue growth this year?",
    "Which region has the highest margin?",
    "Which products are driving profit?",
    "Compare Europe and Asia margins.",
    "Show me our customer churn trend."
  ].filter((q) => q.toLowerCase().includes(search.toLowerCase()));

  const matchedMetrics = GOVERNED_METRIC_CATALOG.filter(
    (m) =>
      m.display_name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl mx-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a business question or search governed metrics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim()) {
                onAskQuestion(search.trim());
                onClose();
              }
            }}
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700/60 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Ask Custom Question option */}
          {search.trim().length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Ask Conversational BI
              </div>
              <button
                onClick={() => {
                  onAskQuestion(search.trim());
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="text-xs text-sky-200 font-medium">
                    Run agentic reasoning for: &quot;{search}&quot;
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Suggested Business Questions */}
          {suggestedQuestions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                <span>Governed Business Questions</span>
                <span className="text-sky-400 text-[10px]">Instant AI Reasoning</span>
              </div>
              <div className="space-y-1">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      onAskQuestion(q);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left text-xs text-slate-300 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" />
                      <span className="group-hover:text-slate-100">{q}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 group-hover:text-sky-400">Ask →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Governed Metrics Catalog match */}
          {matchedMetrics.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                <span>Governed Metrics Catalog</span>
                <span className="text-emerald-400 text-[10px]">{matchedMetrics.length} Available</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {matchedMetrics.slice(0, 6).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectTab("metrics");
                      onClose();
                    }}
                    className="flex flex-col p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/70 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{m.display_name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                        {m.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                      {m.formula}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Page Jump */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onSelectTab("overview");
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 text-left"
              >
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                Executive Overview Dashboard
              </button>
              <button
                onClick={() => {
                  onSelectTab("lineage");
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 text-left"
              >
                <GitFork className="w-3.5 h-3.5 text-indigo-400" />
                End-to-End Data Lineage DAG
              </button>
              <button
                onClick={() => {
                  onSelectTab("trust-center");
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 text-left"
              >
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                Trust Center (SOC2 Assurance)
              </button>
              <button
                onClick={() => {
                  onSelectTab("api-check");
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 text-left"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                API Check & Visual Query Plan
              </button>
              <button
                onClick={() => {
                  onSelectTab("governance");
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 text-left"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                Zero Rogue SQL Blocker & Audit
              </button>
              <button
                onClick={() => {
                  onSelectTab("saved");
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 text-left"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                Saved Insights Knowledge Base
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center text-[11px] text-slate-500">
          MetricMind Agentic Semantic BI • Governed Semantics over Rogue SQL
        </div>
      </div>
    </div>
  );
};
