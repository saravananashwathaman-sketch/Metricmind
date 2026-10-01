"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, ShieldCheck, Clock, Layers, ArrowUpRight } from "lucide-react";
import { ApiCallInfo } from "@/types";

interface ApiCallViewerProps {
  apiCall?: ApiCallInfo;
}

export const ApiCallViewer: React.FC<ApiCallViewerProps> = ({ apiCall }) => {
  const [copied, setCopied] = useState(false);

  if (!apiCall) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        No Cube API call recorded for this blocked or intercepted request.
      </div>
    );
  }

  const payloadString = JSON.stringify(apiCall.payload || {}, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden space-y-3 p-4">
      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Cube REST API Call
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            {apiCall.status_code} OK
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {apiCall.execution_time_ms} ms
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {apiCall.result_rows} rows
          </span>
        </div>
      </div>

      {/* Endpoint Bar */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase">API Endpoint</span>
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-300 font-mono text-xs flex items-center justify-between">
          <span>{apiCall.endpoint}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            POST
          </span>
        </div>
      </div>

      {/* Request Payload */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Request Payload (Sanitized - Zero Secrets)
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy Payload"}</span>
          </button>
        </div>
        <pre className="p-3 rounded-xl bg-black/70 border border-slate-800/80 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
          {payloadString}
        </pre>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Cryptographic tokens & credentials scrubbed before rendering.</span>
      </div>
    </div>
  );
};
