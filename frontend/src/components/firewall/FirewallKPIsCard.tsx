"use client";

import React from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Database,
  Lock,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { FirewallKPIs } from "@/types/firewall";

interface FirewallKPIsCardProps {
  kpis: FirewallKPIs;
}

export const FirewallKPIsCard: React.FC<FirewallKPIsCardProps> = ({ kpis }) => {
  const cards = [
    {
      label: "Requests Today",
      value: kpis.requests_today.toLocaleString(),
      subtext: "100% pre-filtered",
      icon: <Activity className="w-4 h-4 text-sky-400" />,
      color: "border-sky-500/20 bg-sky-500/5 text-sky-400",
      accent: "text-slate-100"
    },
    {
      label: "Approved",
      value: kpis.approved.toLocaleString(),
      subtext: `${((kpis.approved / kpis.requests_today) * 100).toFixed(1)}% compliance rate`,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
      accent: "text-emerald-400"
    },
    {
      label: "Blocked",
      value: kpis.blocked.toLocaleString(),
      subtext: "Zero leakage to Cube",
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      color: "border-rose-500/20 bg-rose-500/5 text-rose-400",
      accent: "text-rose-400"
    },
    {
      label: "SQL Attempts Blocked",
      value: kpis.sql_attempts_blocked.toLocaleString(),
      subtext: "Raw SQL blocked",
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      color: "border-amber-500/20 bg-amber-500/5 text-amber-400",
      accent: "text-amber-400"
    },
    {
      label: "Unknown Metrics Blocked",
      value: kpis.unknown_metrics_blocked.toLocaleString(),
      subtext: "Hallucinated formulas stopped",
      icon: <Database className="w-4 h-4 text-purple-400" />,
      color: "border-purple-500/20 bg-purple-500/5 text-purple-400",
      accent: "text-purple-400"
    },
    {
      label: "Permission Violations",
      value: kpis.permission_violations.toLocaleString(),
      subtext: "RBAC boundaries enforced",
      icon: <Lock className="w-4 h-4 text-red-400" />,
      color: "border-red-500/20 bg-red-500/5 text-red-400",
      accent: "text-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2 hover:border-slate-700 transition-all backdrop-blur-xl group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase line-clamp-1">
              {c.label}
            </span>
            <div className={`p-1.5 rounded-xl border ${c.color} shrink-0`}>
              {c.icon}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className={`text-2xl font-black tracking-tight ${c.accent}`}>
              {c.value}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {c.subtext}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
