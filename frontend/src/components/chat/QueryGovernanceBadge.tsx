"use client";

import React from "react";
import { ShieldCheck, Flame, CheckCircle, Database, Zap } from "lucide-react";
import { GovernanceMetadata } from "@/types";

interface QueryGovernanceBadgeProps {
  governance?: GovernanceMetadata;
  queryCount?: number;
  cached?: boolean;
}

export const QueryGovernanceBadge: React.FC<QueryGovernanceBadgeProps> = ({
  governance,
  queryCount = 1,
  cached = false
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
      {/* Semantic Validation */}
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300">
        <CheckCircle className="w-3 h-3 text-sky-400" />
        <span>Semantic Validated</span>
      </span>

      {/* Firewall Passed */}
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Firewall Passed</span>
      </span>

      {/* Query Count / Cost Governed */}
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
        <Database className="w-3 h-3 text-indigo-400" />
        <span>{queryCount} {queryCount === 1 ? "Query" : "Queries"}</span>
      </span>

      {/* Cache Hit */}
      {cached && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono">
          <Zap className="w-3 h-3 text-purple-400" />
          <span>Cached Result</span>
        </span>
      )}
    </div>
  );
};
