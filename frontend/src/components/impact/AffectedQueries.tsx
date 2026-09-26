"use client";

import React, { useState } from "react";
import { Search, Terminal, Code2, Clock, User, Filter, AlertCircle } from "lucide-react";
import { AffectedAssetItem } from "@/types/impact";

interface AffectedQueriesProps {
  queries: AffectedAssetItem[];
}

export const AffectedQueries: React.FC<AffectedQueriesProps> = ({ queries }) => {
  const [search, setSearch] = useState("");

  const filtered = queries.filter((q) => {
    const s = search.toLowerCase();
    return (
      q.name.toLowerCase().includes(s) ||
      (q.query_sql && q.query_sql.toLowerCase().includes(s)) ||
      q.impact_reason.toLowerCase().includes(s) ||
      q.owner.toLowerCase().includes(s)
    );
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 13 • Saved Query Impact
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            Saved Queries ({queries.length} Registered Dependencies)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            42 queries depend on Gross Margin. Search or filter to test downstream SQL implications.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search queries (e.g. European margin)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Suggested Search Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase">Quick Filter:</span>
        {["European margin analysis", "Q3 profitability", "Product margin comparison", "carrier rate"].map((chip) => (
          <button
            key={chip}
            onClick={() => setSearch(chip)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
          >
            {chip}
          </button>
        ))}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-[11px] text-amber-400 hover:underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Query List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-xl bg-slate-950/40 border border-slate-800">
            No queries matching &quot;{search}&quot;.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
                  <h5 className="text-xs font-bold text-slate-200">{item.name}</h5>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-slate-400">{item.execution_frequency || "Daily automated"}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">By {item.owner}</span>
                </div>
              </div>

              {item.query_sql && (
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800/80 font-mono text-[11px] text-amber-300/90 overflow-x-auto">
                  {item.query_sql}
                </div>
              )}

              <p className="text-[11px] text-slate-400">{item.impact_reason}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
