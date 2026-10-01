"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Terminal,
  Award,
  Layers,
  Database,
  History,
  Lock,
} from "lucide-react";
import { FirewallStatusBanner } from "@/components/firewall/FirewallStatusBanner";
import { FirewallKPIsCard } from "@/components/firewall/FirewallKPIsCard";
import { FirewallRequestInspector } from "@/components/firewall/FirewallRequestInspector";
import { FirewallTestLab } from "@/components/firewall/FirewallTestLab";
import { FirewallAuditTable } from "@/components/firewall/FirewallAuditTable";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import {
  INITIAL_FIREWALL_KPIS,
  RESTRICTED_ENTITIES,
  PROHIBITED_DATA_SOURCES,
} from "@/lib/firewallEngine";
import { APPROVED_MEASURES, APPROVED_DIMENSIONS } from "@/lib/semanticSchema";

export const FirewallDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inspector" | "test-lab" | "audit" | "catalog">("inspector");

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
              Security Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-[#EF4444]" />
            AI Hallucination Firewall
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Every AI-generated analytical request is validated before reaching the semantic layer. Zero rogue SQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="verified" label="Status: PROTECTED" size="md" />
        </div>
      </div>

      {/* Prominent Firewall Status Banner */}
      <FirewallStatusBanner />

      {/* Summary Metrics: Requests, Approved, Blocked, SQL Attempts, Unknown Metrics, Permission Violations */}
      <FirewallKPIsCard kpis={INITIAL_FIREWALL_KPIS} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#334155] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("inspector")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "inspector"
              ? "bg-[#4F46E5] text-[#F8FAFC] shadow-sm"
              : "bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Real-Time Request Inspector</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("test-lab")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "test-lab"
              ? "bg-[#4F46E5] text-[#F8FAFC] shadow-sm"
              : "bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Automated Test Lab</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "audit"
              ? "bg-[#4F46E5] text-[#F8FAFC] shadow-sm"
              : "bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Firewall Audit Log</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "catalog"
              ? "bg-[#4F46E5] text-[#F8FAFC] shadow-sm"
              : "bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Allowlist & Policy Catalog</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "inspector" && <FirewallRequestInspector />}

      {activeTab === "test-lab" && <FirewallTestLab />}

      {activeTab === "audit" && <FirewallAuditTable />}

      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Approved Measures */}
          <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4F46E5]" />
                Approved Measures Allowlist ({APPROVED_MEASURES.length})
              </h3>
              <StatusBadge status="verified" label="Cube Sales.yml" />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {APPROVED_MEASURES.map((m) => (
                <div
                  key={m.name}
                  className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F8FAFC]">{m.display_name}</span>
                    <span className="font-mono text-[11px] text-[#06B6D4]">{m.technical_name}</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#94A3B8]">Formula: {m.formula}</div>
                  <div className="text-[10px] text-[#64748B] flex items-center justify-between pt-1">
                    <span>Version: {m.version}</span>
                    <span className="text-[#10B981] font-semibold">STATUS: {m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approved Dimensions */}
          <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#06B6D4]" />
                Approved Dimensions Allowlist ({APPROVED_DIMENSIONS.length})
              </h3>
              <StatusBadge status="info" label="Geo / Categorical" />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {APPROVED_DIMENSIONS.map((d) => (
                <div
                  key={d.name}
                  className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F8FAFC]">{d.display_name}</span>
                    <span className="font-mono text-[11px] text-[#06B6D4]">{d.cube}.{d.name}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">{d.description}</p>
                  <div className="text-[10px] text-[#64748B] font-mono">
                    Sample Domain: {d.sample_values.slice(0, 4).join(", ")}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RBAC & Restricted Entities */}
          <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2">
              <span className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#EF4444]" />
                Restricted Entities (RBAC Blocked)
              </span>
              <StatusBadge status="blocked" label="Strict Boundary" />
            </div>
            <p className="text-xs text-[#94A3B8]">
              The following entities cannot be retrieved without specialized cryptographic access tokens:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {RESTRICTED_ENTITIES.map((ent, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#0F172A] border border-[#EF4444]/30 font-mono text-[#EF4444] text-xs"
                >
                  {ent}
                </span>
              ))}
            </div>
          </div>

          {/* Prohibited Raw Data Sources */}
          <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2">
              <span className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#F59E0B]" />
                Prohibited Raw Data Sources
              </span>
              <StatusBadge status="pending" label="Direct SQL Intercepted" />
            </div>
            <p className="text-xs text-[#94A3B8]">
              Direct raw table access is prohibited. All analytical requests must target certified semantic cubes:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {PROHIBITED_DATA_SOURCES.map((src, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#0F172A] border border-[#F59E0B]/30 font-mono text-[#F59E0B] text-xs"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
