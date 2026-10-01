"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  const prompts = [
    { text: "Why did European margins decrease last quarter?", tag: "Driver Analysis" },
    { text: "Show Q3 revenue by region", tag: "Revenue" },
    { text: "Compare gross margin across regions", tag: "Profitability" },
    { text: "What was our revenue growth this year?", tag: "Top-line" },
    { text: "Which products are driving profit?", tag: "Product Suite" },
    { text: "Show me our churn trend.", tag: "Retention" },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8]">
        <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
        <span>Suggested Questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p.text}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(p.text)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155]/60 border border-[#334155] text-xs text-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <span>{p.text}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0F172A] text-[#94A3B8] font-mono border border-[#334155]">
              {p.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
