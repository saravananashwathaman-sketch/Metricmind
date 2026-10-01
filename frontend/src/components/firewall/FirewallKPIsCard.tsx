"use client";

import React from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Database,
  Lock,
} from "lucide-react";
import { FirewallKPIs } from "@/types/firewall";

interface FirewallKPIsCardProps {
  kpis: FirewallKPIs;
}

export const FirewallKPIsCard: React.FC<FirewallKPIsCardProps> = ({ kpis }) => {
  const cards = [
    {
      label: "Requests",
      value: kpis.requests_today.toLocaleString(),
      subtext: "100% pre-filtered",
      icon: Activity,
      color: "text-[#06B6D4]",
      accent: "text-[#F8FAFC]",
    },
    {
      label: "Approved",
      value: kpis.approved.toLocaleString(),
      subtext: `${((kpis.approved / kpis.requests_today) * 100).toFixed(1)}% compliance rate`,
      icon: ShieldCheck,
      color: "text-[#10B981]",
      accent: "text-[#10B981]",
    },
    {
      label: "Blocked",
      value: kpis.blocked.toLocaleString(),
      subtext: "Zero leakage to Cube",
      icon: ShieldAlert,
      color: "text-[#EF4444]",
      accent: "text-[#EF4444]",
    },
    {
      label: "SQL Attempts",
      value: kpis.sql_attempts_blocked.toLocaleString(),
      subtext: "Raw SQL blocked",
      icon: Terminal,
      color: "text-[#F59E0B]",
      accent: "text-[#F59E0B]",
    },
    {
      label: "Unknown Metrics",
      value: kpis.unknown_metrics_blocked.toLocaleString(),
      subtext: "Hallucinated formulas stopped",
      icon: Database,
      color: "text-[#F59E0B]",
      accent: "text-[#F59E0B]",
    },
    {
      label: "Permission Violations",
      value: kpis.permission_violations.toLocaleString(),
      subtext: "RBAC boundaries enforced",
      icon: Lock,
      color: "text-[#EF4444]",
      accent: "text-[#EF4444]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-[#475569] transition-colors flex flex-col justify-between space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider truncate">
                {c.label}
              </span>
              <Icon className={`w-4 h-4 shrink-0 ${c.color}`} />
            </div>

            <div className="space-y-0.5">
              <div className={`text-2xl font-bold tracking-tight ${c.accent}`}>
                {c.value}
              </div>
              <div className="text-[10px] text-[#64748B] truncate">
                {c.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
