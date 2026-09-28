"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Layers,
  Database,
  Terminal,
  Lock,
  Cpu,
  Server
} from "lucide-react";

export const FirewallStatusBanner: React.FC = () => {
  const statusItems = [
    {
      label: "Semantic Layer",
      value: "CONNECTED",
      status: "good",
      icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      label: "Cube API",
      value: "CONNECTED",
      status: "good",
      icon: <Server className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      label: "Raw SQL",
      value: "BLOCKED",
      status: "blocked",
      icon: <Terminal className="w-3.5 h-3.5 text-rose-400" />
    },
    {
      label: "Unknown Metrics",
      value: "BLOCKED",
      status: "blocked",
      icon: <Database className="w-3.5 h-3.5 text-rose-400" />
    },
    {
      label: "Unauthorized Data",
      value: "BLOCKED",
      status: "blocked",
      icon: <Lock className="w-3.5 h-3.5 text-rose-400" />
    },
    {
      label: "Schema Validation",
      value: "ACTIVE",
      status: "good",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-100 tracking-tight">
                🛡️ FIREWALL ACTIVE
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                ZERO-TRUST GATEWAY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Every AI-generated analytical request is strictly validated against the semantic catalog before touching warehouse infrastructure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>System Status: PROTECTED</span>
          </div>
        </div>
      </div>

      {/* 6 Grid Policy Badges (Section 22) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border text-xs flex flex-col justify-between space-y-1.5 ${
              item.status === "good"
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-rose-500/5 border-rose-500/20"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{item.label}</span>
              {item.icon}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono text-xs font-black ${
                  item.status === "good" ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
