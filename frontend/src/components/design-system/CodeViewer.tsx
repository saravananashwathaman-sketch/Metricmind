"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeViewerProps {
  code: string | object;
  language?: string;
  title?: string;
  tabs?: { id: string; label: string; content: string | object }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language = "json",
  title,
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const formattedCode =
    typeof code === "string" ? code : JSON.stringify(code, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl bg-[#0F172A] border border-[#334155] overflow-hidden text-xs shadow-md ${className}`}
    >
      {/* Top Bar / Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#020617] border-b border-[#334155]">
        {tabs && tabs.length > 0 ? (
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="font-mono text-[#94A3B8] text-[11px]">
            {title || language.toUpperCase()}
          </span>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors border border-transparent hover:border-[#334155] cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[#10B981]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 overflow-x-auto max-h-96 custom-scrollbar bg-[#020617]/70">
        <pre className="font-mono text-xs text-[#06B6D4] leading-relaxed select-text">
          <code>{formattedCode}</code>
        </pre>
      </div>
    </div>
  );
};
