"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  disabled = false
}) => {
  const prompts = [
    { text: "Why did our European margins drop last quarter?", tag: "Demo Scenario" },
    { text: "What was our revenue growth this year?", tag: "Top-line" },
    { text: "Which region has the highest margin?", tag: "Profitability" },
    { text: "Which products are driving profit?", tag: "Products" },
    { text: "Compare Europe and Asia.", tag: "Regional" },
    { text: "What caused the revenue decline?", tag: "Variance" },
    { text: "Show me our churn trend.", tag: "Customer" },
    { text: "Which country has the highest logistics cost?", tag: "Cost Driver" }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>Suggested Governed Questions:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p.text}
            disabled={disabled}
            onClick={() => onSelectPrompt(p.text)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-xs text-slate-300 hover:text-sky-300 hover:border-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
          >
            <span>{p.text}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 group-hover:bg-sky-500/20 group-hover:text-sky-300 font-mono">
              {p.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
