"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Layers,
  Database,
  Terminal,
  Lock,
  Server,
} from "lucide-react";
import { StatusBadge } from "@/components/design-system/StatusBadge";

export const FirewallStatusBanner: React.FC = () => {
  const statusItems = [
    { label: "Semantic Layer", value: "CONNECTED", status: "good", icon: Layers },
    { label: "Cube API", value: "CONNECTED", status: "good", icon: Server },
    { label: "Raw SQL", value: "BLOCKED", status: "blocked", icon: Terminal },
    { label: "Unknown Metrics", value: "BLOCKED", status: "blocked", icon: Database },
    { label: "Unauthorized Data", value: "BLOCKED", status: "blocked", icon: Lock },
    { label: "Schema Validation", value: "ACTIVE", status: "good", icon: CheckCircle2 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-5">
      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                AI Hallucination Firewall
              </h2>
              <StatusBadge status="verified" label="PROTECTED" />
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Every AI-generated analytical request is validated against the semantic catalog before reaching data storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-[#0F172A] text-[#10B981] border border-[#334155] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Status: PROTECTED</span>
          </span>
        </div>
      </div>

      {/* Policy Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusItems.map((item, idx) => {
          const Icon = item.icon;
          const isGood = item.status === "good";

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex flex-col justify-between space-y-1.5 bg-[#0F172A] ${
                isGood ? "border-[#334155]" : "border-[#334155]"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                <span className="truncate">{item.label}</span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isGood ? "text-[#10B981]" : "text-[#EF4444]"}`} />
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-mono text-xs font-bold ${
                    isGood ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
