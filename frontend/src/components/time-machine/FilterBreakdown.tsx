"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, Check, X, ShieldAlert, Sparkles } from "lucide-react";

interface FilterBreakdownProps {
  filters: Record<string, string>;
}

export const FilterBreakdown: React.FC<FilterBreakdownProps> = ({ filters }) => {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    Region: true,
    Quarter: true,
    "Order Status": false,
    Currency: false,
    "Customer Segment": false
  });

  const toggleExpand = (k: string) => {
    setExpandedKeys((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const filterDetails: Record<string, { included: string; excluded: string; reason: string }> = {
    Region: {
      included: "Germany, France, Spain, Italy, UK, Netherlands (all designated EMEA European entities)",
      excluded: "North America, APAC, India, LATAM operations",
      reason: "Isolated to measure European regional gross margin drag and carrier surcharges."
    },
    Quarter: {
      included: "Transactions timestamped between 01 Jul 2026 00:00:00 and 30 Sep 2026 23:59:59 UTC",
      excluded: "Q1 2026, Q2 2026, and unbilled forward revenue",
      reason: "Governed calendar quarter close boundary."
    },
    "Order Status": {
      included: "Completed, Closed-Won, Billed, Contract-Activated transactions",
      excluded: "Cancelled, Draft, Suspended, or Pending Credit Check orders",
      reason: "Excludes unrealized or disputed orders to ensure GAAP compliance."
    },
    Currency: {
      included: "INR (₹) converted at daily governed statutory exchange rate at time of billing",
      excluded: "Unhedged FX estimates or nominal local non-functional currencies",
      reason: "Standard MetricMind enterprise reporting base currency."
    },
    "Customer Segment": {
      included: "Strategic Enterprise Accounts, Mid-Market Commercial Tier, Public Sector",
      excluded: "Non-commercial test accounts, internal employee sandbox tenants",
      reason: "Evaluates comprehensive enterprise customer book."
    }
  };

  const filterObj = filters || {};

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            FILTERS APPLIED TO THIS NUMBER
          </h3>
        </div>
        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
          {Object.keys(filterObj).length} Active Constraints
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Click any filter to inspect exact inclusion/exclusion boundaries applied by the Semantic Layer:
      </p>

      {/* Filter items list */}
      <div className="space-y-2.5">
        {Object.entries(filterObj).map(([key, val]) => {

          const isExpanded = !!expandedKeys[key];
          const detail = filterDetails[key] || {
            included: val,
            excluded: `Non-${val} elements`,
            reason: `Restricted by executive query constraint on ${key}.`
          };

          return (
            <div
              key={key}
              className="rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden transition-all"
            >
              {/* Header row */}
              <button
                type="button"
                onClick={() => toggleExpand(key)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-300">{key}</span>
                  <span className="text-xs text-slate-400">=</span>
                  <span className="text-xs font-mono font-semibold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {val}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] hidden sm:inline">
                    {isExpanded ? "Hide Details" : "Inclusion/Exclusion"}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expandable details */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/60 bg-slate-900/30 space-y-2 text-xs animate-in fade-in duration-200">
                  <div className="flex items-start gap-2 text-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Included: </strong>
                      {detail.included}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-rose-300">
                    <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Excluded: </strong>
                      {detail.excluded}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 pl-5 leading-relaxed">
                    <span className="font-semibold text-slate-300">Governance Context: </span>
                    {detail.reason}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
