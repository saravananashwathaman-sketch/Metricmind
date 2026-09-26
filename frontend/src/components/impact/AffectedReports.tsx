"use client";

import React from "react";
import { FileText, User, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { AffectedAssetItem } from "@/types/impact";

interface AffectedReportsProps {
  reports: AffectedAssetItem[];
}

export const AffectedReports: React.FC<AffectedReportsProps> = ({ reports }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 12 • Report Impact
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Affected Reports ({reports.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal disclosure documents, board slide decks, and recurring monthly financial memos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{rep.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {rep.sections?.length || 2} sections
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {rep.impact_reason}
              </p>
            </div>

            {rep.sections && rep.sections.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Affected Sections</span>
                <ul className="space-y-1">
                  {rep.sections.map((s, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="truncate">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">{rep.owner}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{rep.last_updated}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
