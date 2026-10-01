"use client";

import React from "react";
import { Check, ShieldCheck, Database, Sparkles } from "lucide-react";

export const BrandPanel: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between min-h-full p-8 lg:p-14 bg-[#0F172A] border-r border-[#334155]">
      {/* Top Branding Header */}
      <div className="space-y-6 max-w-lg my-auto py-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#4F46E5] text-white font-bold text-base shadow-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wide text-[#F8FAFC]">
                MetricMind
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#4F46E5]/15 text-[#818CF8] border border-[#4F46E5]/30 rounded">
                ENTERPRISE BI
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">Governed Semantic Engine</p>
          </div>
        </div>

        {/* Heading & Tagline */}
        <div className="space-y-3 pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] tracking-tight leading-tight">
            Governed Analytics. <br />
            <span className="text-[#06B6D4]">Zero Rogue SQL.</span>
          </h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            MetricMind guarantees that AI agents only execute against certified business semantics with dbt and Cube validation.
          </p>
          <p className="text-xs text-[#64748B] font-mono">
            &ldquo;Ask business questions. Get verified answers.&rdquo;
          </p>
        </div>

        {/* Three Key Feature Highlights */}
        <div className="pt-4 space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1E293B] border border-[#334155]">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#10B981]/15 text-[#10B981] shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#F8FAFC]">Governed Semantic Layer</span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Single source of truth with version-controlled definitions and strict Cube contracts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1E293B] border border-[#334155]">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#06B6D4]/15 text-[#06B6D4] shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#F8FAFC]">AI Hallucination Firewall</span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                16-point zero-trust firewall prevents unverified SQL queries and protected data leakage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1E293B] border border-[#334155]">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#4F46E5]/15 text-[#818CF8] shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#F8FAFC]">Explain This Number Time Machine</span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Complete auditability and mathematical reconstruction for any financial number.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 text-xs text-[#64748B]">
        Protected by Enterprise RBAC & SOC-2 Type II Certified Architecture
      </div>
    </div>
  );
};
