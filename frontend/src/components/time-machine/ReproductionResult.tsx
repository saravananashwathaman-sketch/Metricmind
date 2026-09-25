"use client";

import React, { useState } from "react";
import { RefreshCw, CheckCircle2, ShieldCheck, Sparkles, Hash, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { ReproductionResponse } from "@/types/timeMachine";

interface ReproductionResultProps {
  metricId: string;
  metricName: string;
  originalValue: number;
  originalFormatted: string;
  fingerprint: string;
  snapshotId: string;
}

export const ReproductionResult: React.FC<ReproductionResultProps> = ({
  metricId,
  metricName,
  originalValue,
  originalFormatted,
  fingerprint,
  snapshotId
}) => {
  const [reproducing, setReproducing] = useState(false);
  const [reproductionData, setReproductionData] = useState<ReproductionResponse | null>(null);

  const handleReproduce = async () => {
    setReproducing(true);
    try {
      const res = await api.reproduceNumber(metricId, fingerprint);
      setReproductionData(res);
    } catch (e) {
      console.error("Failed to reproduce number", e);
    } finally {
      setReproducing(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${reproducing ? "animate-spin" : ""}`} />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            REPRODUCE THIS NUMBER
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
          Deterministic Reproducibility Test
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Re-execute the exact same semantic query payload against the immutable data snapshot ({snapshotId}) to verify that zero calculation drift occurred.
      </p>

      {/* Action Button */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleReproduce}
          disabled={reproducing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${reproducing ? "animate-spin" : ""}`} />
          <span>{reproducing ? "Re-executing Semantic Query..." : "Reproduce This Number"}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Hash className="w-3.5 h-3.5 text-slate-400" />
          <span>Fingerprint: {fingerprint}</span>
        </div>
      </div>

      {/* Reproduction Results Box */}
      {reproductionData && (
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Verification Outcome
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {reproductionData.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Original Value</span>
              <div className="text-xl font-black text-slate-100 font-mono">
                {reproductionData.original_formatted}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 space-y-0.5">
              <span className="text-[10px] text-emerald-400 uppercase font-mono">Reproduced Value</span>
              <div className="text-xl font-black text-emerald-300 font-mono">
                {reproductionData.reproduced_formatted}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Delta Difference</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {reproductionData.difference_pp.toFixed(2)} pp
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 font-mono pt-1 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <span>Query Runtime: {reproductionData.execution_ms}ms</span>
            <span className="text-emerald-400">{reproductionData.deterministic_guarantee}</span>
          </div>
        </div>
      )}
    </div>
  );
};
