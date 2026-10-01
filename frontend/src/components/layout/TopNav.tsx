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
  ChevronDown,
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
  onToggleDemoMode,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const quarters = ["Q2 2026", "Q1 2026", "Q4 2025", "Q3 2025", "FY 2025-26"];
  const regions = ["Global", "Europe", "North America", "India", "APAC"];
  const roles: Role[] = ["Executive", "Finance Analyst", "Sales Analyst", "Admin"];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#020617]/95 border-b border-[#334155] backdrop-blur-md">
      {/* Search / Command palette trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center justify-between w-full max-w-md px-3.5 py-2 text-xs text-[#94A3B8] bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] rounded-xl transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#64748B] group-hover:text-[#F8FAFC] transition-colors" />
            <span className="truncate">Ask a governed question or search metrics...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#1E293B] border border-[#334155] rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Global Dimension Filters & Governance Context */}
      <div className="flex items-center gap-2.5">
        {/* Quarter Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] border border-[#334155] rounded-xl text-xs text-[#94A3B8]">
          <Calendar className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
          <select
            value={quarter}
            onChange={(e) => onChangeQuarter(e.target.value)}
            className="bg-transparent border-none text-xs text-[#F8FAFC] focus:outline-none cursor-pointer pr-1"
          >
            {quarters.map((q) => (
              <option key={q} value={q} className="bg-[#0F172A] text-[#F8FAFC]">
                {q}
              </option>
            ))}
          </select>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] border border-[#334155] rounded-xl text-xs text-[#94A3B8]">
          <Globe2 className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
          <select
            value={region}
            onChange={(e) => onChangeRegion(e.target.value)}
            className="bg-transparent border-none text-xs text-[#F8FAFC] focus:outline-none cursor-pointer pr-1"
          >
            {regions.map((r) => (
              <option key={r} value={r} className="bg-[#0F172A] text-[#F8FAFC]">
                {r === "Global" ? "Global Scope" : r}
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-xs font-medium text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="hidden sm:inline">{userRole}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 py-1 bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#334155]">
                Switch Role Context
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    onChangeRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                    userRole === r
                      ? "bg-[#4F46E5]/15 text-[#818CF8] font-semibold"
                      : "text-[#94A3B8] hover:bg-[#334155]/50 hover:text-[#F8FAFC]"
                  }`}
                >
                  <span>{r}</span>
                  {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F46E5]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            title="Governance Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#06B6D4] rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 p-3 bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl z-50 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#334155] pb-2">
                <span className="text-xs font-bold text-[#F8FAFC]">Governance Alerts</span>
                <span className="text-[10px] text-[#06B6D4] font-medium">3 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#0F172A] border border-[#334155] space-y-0.5">
                  <div className="flex items-center justify-between font-medium text-[#10B981] text-[11px]">
                    <span>Metric Verified</span>
                    <span className="text-[#64748B] text-[9px]">10m ago</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px]">
                    Gross Margin v3.1.2 was signed off by Priya Sharma.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#0F172A] border border-[#334155] space-y-0.5">
                  <div className="flex items-center justify-between font-medium text-[#F59E0B] text-[11px]">
                    <span>Rogue SQL Blocked</span>
                    <span className="text-[#64748B] text-[9px]">1h ago</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px]">
                    Un-governed raw table query was intercepted and rerouted to semantic catalog.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#0F172A] border border-[#334155] space-y-0.5">
                  <div className="flex items-center justify-between font-medium text-[#06B6D4] text-[11px]">
                    <span>dbt Mart Synchronized</span>
                    <span className="text-[#64748B] text-[9px]">2h ago</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px]">
                    marts.finance.fct_sales successfully refreshed with 0 test failures.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo / Prod Mode Button */}
        <button
          type="button"
          onClick={onToggleDemoMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
            isDemoMode
              ? "bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
              : "bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30"
          }`}
          title="Toggle runtime mode"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isDemoMode ? "Demo Mode" : "Production"}</span>
        </button>
      </div>
    </header>
  );
};
