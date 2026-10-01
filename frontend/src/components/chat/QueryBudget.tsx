"use client";

import React from "react";
import { Coins, AlertTriangle } from "lucide-react";
import { QueryBudgetInfo } from "@/types";

interface QueryBudgetProps {
  budget?: QueryBudgetInfo;
  className?: string;
  showBar?: boolean;
}

export const QueryBudget: React.FC<QueryBudgetProps> = ({
  budget = { count: 1, limit: 5, remaining: 4, status: "approved" },
  className = "",
  showBar = false
}) => {
  const isNearLimit = budget.remaining <= 1;
  const isExceeded = budget.remaining === 0 || budget.status === "exceeded";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono font-medium transition-colors ${
        isExceeded
          ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
          : isNearLimit
          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
          : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
      } ${className}`}
      title={`Query Budget: ${budget.count} of ${budget.limit} allowed semantic queries used.`}
    >
      <Coins className="w-3 h-3 text-indigo-400 shrink-0" />
      <span>
        Budget: <strong className="text-slate-100">{budget.count}</strong> / {budget.limit}
      </span>

      {showBar && (
        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1 hidden sm:block">
          <div
            className={`h-full transition-all duration-300 ${
              isExceeded ? "bg-rose-400" : isNearLimit ? "bg-amber-400" : "bg-indigo-400"
            }`}
            style={{ width: `${Math.min(100, (budget.count / budget.limit) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
