"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { OverviewView } from "@/components/views/OverviewView";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ExecutiveAnalyticsView } from "@/components/views/ExecutiveAnalyticsView";
import { SemanticCatalogView } from "@/components/views/SemanticCatalogView";
import { DataLineageView } from "@/components/views/DataLineageView";
import { GovernanceView } from "@/components/views/GovernanceView";
import { SavedInsightsView } from "@/components/views/SavedInsightsView";
import { QueryHistoryView } from "@/components/views/QueryHistoryView";
import { SettingsView } from "@/components/views/SettingsView";
import { QueryExplorerView } from "@/components/views/QueryExplorerView";
import { DatabaseAdminView } from "@/components/views/DatabaseAdminView";
import { SemanticAdminView } from "@/components/views/SemanticAdminView";
import { TrustCenterView } from "@/components/views/TrustCenterView";
import { ApiCheckView } from "@/components/views/ApiCheckView";
import { ProfileView } from "@/components/views/ProfileView";
import { Role, ExecutiveOverviewData, MetricMindChatResponse, UserProfile } from "@/types";
import { DEFAULT_OVERVIEW_DATA, DEFAULT_USER_PROFILE } from "@/lib/mockData";
import { api } from "@/lib/api";

export function MetricMindApp({ initialTab = "overview" }: { initialTab?: NavTab }) {
  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [userRole, setUserRole] = useState<Role>("Executive");
  const [quarter, setQuarter] = useState("Q2 2026");
  const [region, setRegion] = useState("Global");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Cross-view state transfer (e.g. asking a question from Overview jumps to Ask page)
  const [pendingQuestion, setPendingQuestion] = useState<string | undefined>(undefined);
  const [selectedLineageMetric, setSelectedLineageMetric] = useState<string>("gross_margin");
  const [savedInsightIds, setSavedInsightIds] = useState<string[]>(["INS_EUR_001", "INS_REV_002"]);
  const [overviewData, setOverviewData] = useState<ExecutiveOverviewData>(DEFAULT_OVERVIEW_DATA);

  useEffect(() => {
    // Check initial URL path or popstate
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/profile") {
        setActiveTab("profile");
      }
      const handlePopState = () => {
        if (window.location.pathname === "/profile") {
          setActiveTab("profile");
        } else if (window.location.pathname === "/" || window.location.pathname === "") {
          setActiveTab("overview");
        }
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  useEffect(() => {
    // Load profile
    api.getProfile().then((data) => {
      if (data) {
        setUserProfile(data);
        if (data.role) setUserRole(data.role as Role);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadOverview();
  }, [quarter, region]);

  const loadOverview = async () => {
    try {
      const data = await api.getOverview(quarter, region);
      setOverviewData(data);
    } catch (e) {
      console.warn("Failed to load overview data from API", e);
    }
  };

  const handleAskQuestion = (questionText: string) => {
    setPendingQuestion(questionText);
    setActiveTab("ask");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewLineage = (metricId: string) => {
    setSelectedLineageMetric(metricId);
    setActiveTab("lineage");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveInsight = async (res: MetricMindChatResponse) => {
    try {
      await api.saveInsight({
        title: `${res.governed_metric.name} Analysis — ${res.kpi_comparison.current_period}`,
        question: res.question,
        metric_id: res.governed_metric.id,
        executive_summary: res.executive_summary,
        chart_type: res.primary_chart_type,
        chart_data: res.primary_chart_data,
        drivers: res.drivers,
        filters: res.calculation_details.applied_filters,
        semantic_definition: res.governed_metric.formula,
        created_by: "Rajesh Kapoor"
      });
      setSavedInsightIds((prev) => [...prev, res.conversation_id]);
    } catch (e) {
      console.error("Failed to save insight", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500/30 selection:text-sky-200">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === "profile") {
            if (typeof window !== "undefined") window.history.pushState({}, "", "/profile");
          } else {
            if (typeof window !== "undefined" && window.location.pathname === "/profile") {
              window.history.pushState({}, "", "/");
            }
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
        onChangeRole={(role) => {
          setUserRole(role);
          setUserProfile((prev) => ({ ...prev, role }));
        }}
        isDemoMode={isDemoMode}
        userProfile={userProfile}
      />

      {/* Main Workspace Frame */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        {/* Top Header Bar */}
        <TopNav
          quarter={quarter}
          onChangeQuarter={setQuarter}
          region={region}
          onChangeRegion={setRegion}
          userRole={userRole}
          onChangeRole={setUserRole}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 pb-16">
          {activeTab === "overview" && (
            <OverviewView
              data={overviewData}
              onAskQuestion={handleAskQuestion}
              onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            />
          )}

          {activeTab === "ask" && (
            <ChatInterface
              userRole={userRole}
              region={region}
              quarter={quarter}
              initialQuestion={pendingQuestion}
              onSaveInsight={handleSaveInsight}
              onViewLineage={handleViewLineage}
              savedInsightIds={savedInsightIds}
            />
          )}

          {activeTab === "trust-center" && (
            <TrustCenterView />
          )}

          {activeTab === "api-check" && (
            <ApiCheckView />
          )}

          {activeTab === "query-explorer" && (
            <QueryExplorerView />
          )}

          {activeTab === "analytics" && (
            <ExecutiveAnalyticsView onAskQuestion={handleAskQuestion} />
          )}

          {(activeTab === "metrics" || activeTab === "catalog") && (
            <SemanticCatalogView
              onAskQuestion={handleAskQuestion}
              onViewLineage={handleViewLineage}
            />
          )}

          {activeTab === "semantic-admin" && (
            <SemanticAdminView userRole={userRole} />
          )}

          {activeTab === "lineage" && (
            <DataLineageView
              initialMetricId={selectedLineageMetric}
              onAskQuestion={handleAskQuestion}
            />
          )}

          {activeTab === "database-admin" && (
            <DatabaseAdminView />
          )}

          {activeTab === "saved" && (
            <SavedInsightsView onAskQuestion={handleAskQuestion} />
          )}

          {activeTab === "history" && (
            <QueryHistoryView onAskQuestion={handleAskQuestion} />
          )}

          {activeTab === "governance" && <GovernanceView />}

          {activeTab === "settings" && (
            <SettingsView
              isDemoMode={isDemoMode}
              onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView
              userRole={userRole}
              isDemoMode={isDemoMode}
              onAskQuestion={handleAskQuestion}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                if (tab !== "profile" && typeof window !== "undefined" && window.location.pathname === "/profile") {
                  window.history.pushState({}, "", "/");
                }
              }}
              onProfileUpdated={(updated) => {
                setUserProfile(updated);
                if (updated.role) {
                  setUserRole(updated.role as Role);
                }
              }}
            />
          )}
        </main>
      </div>

      {/* Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onAskQuestion={(q) => {
          handleAskQuestion(q);
          setIsCommandPaletteOpen(false);
        }}
      />
    </div>
  );
}

export default function Home() {
  return <MetricMindApp initialTab="overview" />;
}
