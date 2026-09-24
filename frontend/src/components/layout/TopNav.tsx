"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  Globe2,
  Bell,
  Shield,
  SlidersHorizontal,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Role } from "@/types";

interface TopNavProps {
  quarter: string;
  onChangeQuarter: (q: string) => void;
  region: string;
  onChangeRegion: (r: string) => void;
  userRole: Role;
  onChangeRole: (r: Role) => void;
  onOpenCommandPalette: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  quarter,
  onChangeQuarter,
  region,
  onChangeRegion,
  userRole,
  onChangeRole,
  onOpenCommandPalette,
  isDemoMode,
  onToggleDemoMode
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const quarters = ["Q2 2026", "Q1 2026", "Q4 2025", "Q3 2025", "FY 2025-26"];
  const regions = ["Global", "Europe", "North America", "India", "APAC"];
  const roles: Role[] = ["Executive", "Finance Analyst", "Sales Analyst", "Admin"];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl">
      {/* Search / Command palette trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center justify-between w-full max-w-md px-3.5 py-2 text-xs text-slate-400 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 rounded-xl transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 transition-colors" />
            <span className="truncate">Ask a governed question or search metrics...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700/60 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Global Dimension Filters & Governance Context */}
      <div className="flex items-center gap-3">
        {/* Quarter Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <select
            value={quarter}
            onChange={(e) => onChangeQuarter(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {quarters.map((q) => (
              <option key={q} value={q} className="bg-slate-900 text-slate-200">
                {q}
              </option>
            ))}
          </select>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs text-slate-300">
          <Globe2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={region}
            onChange={(e) => onChangeRegion(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {regions.map((r) => (
              <option key={r} value={r} className="bg-slate-900 text-slate-200">
                {r === "Global" ? "Global Scope" : r}
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-xs font-medium text-slate-300 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{userRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 py-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                Switch Role Context
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onChangeRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    userRole === r
                      ? "bg-sky-500/15 text-sky-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span>{r}</span>
                  {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
            title="Governance Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">Governance & System Notifications</span>
                <span className="text-[10px] text-sky-400 font-medium">3 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/70 space-y-0.5">
                  <div className="flex items-center justify-between font-medium text-emerald-400 text-[11px]">
                    <span>Metric Verified</span>
                    <span className="text-slate-500 text-[9px]">10m ago</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Gross Margin v3.1.2 was signed off by Priya Sharma.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/70 space-y-0.5">
                  <div className="flex items-center justify-between font-medium text-amber-400 text-[11px]">
                    <span>Rogue SQL Blocked</span>
                    <span className="text-slate-500 text-[9px]">1h ago</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Un-governed raw table query was intercepted and rerouted to semantic catalog.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/70 space-y-0.5">
                  <div className="flex items-center justify-between font-medium text-sky-400 text-[11px]">
                    <span>dbt Mart Synchronized</span>
                    <span className="text-slate-500 text-[9px]">2h ago</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    marts.finance.fct_sales successfully refreshed with 0 test failures.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo / Prod Mode Button */}
        <button
          onClick={onToggleDemoMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            isDemoMode
              ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30"
              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
          }`}
          title="Toggle between Interactive Demo Mode and Connected Production Mode"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isDemoMode ? "Demo Mode" : "Production"}</span>
        </button>
      </div>
    </header>
  );
};
