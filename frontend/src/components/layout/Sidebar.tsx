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
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Server,
  Layers,
  Search,
  Award,
  Terminal,
  Clock,
  Wand2,
  ShieldAlert,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { Role, UserProfile } from "@/types";

export type NavTab =
  | "overview"
  | "time-machine"
  | "metric-impact"
  | "ask"
  | "firewall"
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
  | "settings"
  | "profile";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole: Role;
  onChangeRole: (role: Role) => void;
  isDemoMode: boolean;
  userProfile?: UserProfile;
  onLogout?: () => void;
}

interface NavGroup {
  title: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  userRole,
  isDemoMode,
  userProfile,
  onLogout,
}) => {
  const navGroups: NavGroup[] = [
    {
      title: "OVERVIEW",
      items: [
        { id: "overview", label: "Executive Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "AI ANALYTICS",
      items: [
        { id: "ask", label: "Ask MetricMind", icon: Sparkles, badge: "AI" },
        { id: "analytics", label: "Agentic Analysis", icon: BarChart3 },
        { id: "saved", label: "Dynamic Insights", icon: BookmarkCheck },
      ],
    },
    {
      title: "SEMANTIC GOVERNANCE",
      items: [
        { id: "metrics", label: "Semantic Layer", icon: Database },
        { id: "firewall", label: "AI Hallucination Firewall", icon: ShieldAlert, badge: "Protected" },
        { id: "governance", label: "Governance Audit", icon: ShieldCheck },
        { id: "trust-center", label: "Allowlist & Policy Catalog", icon: Award },
        { id: "lineage", label: "Data Lineage", icon: GitFork },
      ],
    },
    {
      title: "METRIC INTELLIGENCE",
      items: [
        { id: "time-machine", label: "Explain This Number", icon: Clock },
        { id: "metric-impact", label: "Metric Impact Simulator", icon: Wand2, badge: "Sandbox" },
        { id: "query-explorer", label: "Semantic Query Explorer", icon: Search },
        { id: "history", label: "Metric Version History", icon: History },
        { id: "api-check", label: "Cube API Architecture", icon: Terminal },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "profile", label: "Profile", icon: UserCheck },
        { id: "settings", label: "Settings", icon: Settings },
        { id: "database-admin", label: "Database Admin", icon: Server },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-[#020617] border-r border-[#334155] transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#334155] bg-[#020617]">
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer overflow-hidden text-left bg-transparent border-none p-0"
          onClick={() => onSelectTab("overview")}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4F46E5] text-white shrink-0 font-bold text-sm shadow-sm">
            M
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-wide text-[#F8FAFC] flex items-center gap-1.5">
                MetricMind
                <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-[#4F46E5]/15 text-[#818CF8] border border-[#4F46E5]/30 rounded">
                  BI
                </span>
              </span>
              <span className="text-[10px] text-[#64748B] truncate">
                Governed Semantic Engine
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors shrink-0 cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List Organized by Category */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer group ${
                    isActive
                      ? "bg-[#4F46E5]/15 text-[#F8FAFC] border-l-2 border-[#4F46E5]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-[#4F46E5]" : "text-[#64748B] group-hover:text-[#94A3B8]"
                    }`}
                  />

                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1 truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                            item.badge === "Protected"
                              ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                              : item.badge === "Sandbox"
                              ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                              : "bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30"
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
        ))}
      </div>

      {/* Footer: User Profile & Mode */}
      <div className="p-3 border-t border-[#334155] bg-[#020617] space-y-2">
        {/* User Card */}
        <button
          type="button"
          onClick={() => onSelectTab("profile")}
          title={collapsed ? userProfile?.name || "User Profile" : undefined}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#1E293B]/50 hover:bg-[#1E293B] border border-[#334155] text-left transition-colors cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#4F46E5]/20 text-[#818CF8] border border-[#4F46E5]/30 flex items-center justify-center font-bold text-xs shrink-0">
            {userProfile?.name?.charAt(0) || "A"}
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                {userProfile?.name || "Ashwathaman"}
              </span>
              <span className="text-[10px] text-[#94A3B8] truncate">
                {userRole}
              </span>
            </div>
          )}
        </button>

        {/* Runtime Badge */}
        {!collapsed && (
          <div className="flex items-center justify-between px-2 text-[10px] text-[#64748B]">
            <span>Governance</span>
            <span className="font-mono text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {isDemoMode ? "DEMO MODE" : "PRODUCTION"}
            </span>
          </div>
        )}

        {/* Sign Out */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Sign Out" : undefined}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
