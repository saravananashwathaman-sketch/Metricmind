"use client";

import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Database,
  GitFork,
  BookmarkCheck,
  History,
  ShieldCheck,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Server,
  Zap,
  Search,
  Award,
  Terminal
} from "lucide-react";
import { Role } from "@/types";

export type NavTab =
  | "overview"
  | "ask"
  | "api-check"
  | "trust-center"
  | "query-explorer"
  | "analytics"
  | "metrics"
  | "catalog"
  | "semantic-admin"
  | "lineage"
  | "database-admin"
  | "saved"
  | "history"
  | "governance"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole: Role;
  onChangeRole: (role: Role) => void;
  isDemoMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  userRole,
  isDemoMode
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "overview", label: "Executive Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: "ask",
      label: "Ask MetricMind",
      icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      badge: "AI Agent"
    },
    {
      id: "trust-center",
      label: "Trust Center",
      icon: <Award className="w-4 h-4 text-amber-400" />,
      badge: "SOC2"
    },
    {
      id: "api-check",
      label: "API Check & Plan",
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      badge: "Cube DAG"
    },
    {
      id: "query-explorer",
      label: "Query Explorer",
      icon: <Search className="w-4 h-4 text-amber-400" />,
      badge: "10 Tests"
    },
    { id: "analytics", label: "Executive Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "metrics", label: "Governed Metrics", icon: <Database className="w-4 h-4" /> },
    { id: "semantic-admin", label: "Semantic Layer Admin", icon: <Layers className="w-4 h-4 text-indigo-400" /> },
    { id: "lineage", label: "Data Lineage", icon: <GitFork className="w-4 h-4" /> },
    {
      id: "database-admin",
      label: "Database Admin",
      icon: <Server className="w-4 h-4 text-cyan-400" />,
      badge: "Postgres"
    },
    { id: "saved", label: "Saved Insights", icon: <BookmarkCheck className="w-4 h-4" /> },
    { id: "history", label: "Query History", icon: <History className="w-4 h-4" /> },
    {
      id: "governance",
      label: "Governance Audit",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      badge: "5x Repeat"
    },
    { id: "settings", label: "Settings & DW", icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-slate-950/90 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
        <div
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
          onClick={() => onSelectTab("overview")}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 shadow-lg shadow-sky-500/20 text-white shrink-0">
            <Zap className="w-5 h-5 fill-white/20" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-wider text-slate-100 uppercase flex items-center gap-1.5">
                MetricMind
                <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                  BI
                </span>
              </span>
              <span className="text-[10px] text-slate-400 truncate">Governed Semantic Engine</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? "bg-gradient-to-r from-sky-500/15 to-indigo-500/10 text-sky-300 border border-sky-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                        item.badge === "Zero Rogue SQL"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Governance & Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Warehouse Status
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Semantic Layer</span>
              <span className="text-sky-400 font-medium">Cube/dbt Synced</span>
            </div>
          </div>
        )}

        {/* User profile & active role */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            RK
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-200 truncate">Rajesh Kapoor</span>
              <div className="flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="text-[10px] text-sky-400 truncate">{userRole}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mode Pill */}
        {!collapsed && (
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-500">
            <span>Runtime</span>
            <span
              className={`px-2 py-0.5 rounded font-mono font-bold ${
                isDemoMode
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              }`}
            >
              {isDemoMode ? "DEMO MODE" : "PRODUCTION"}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
