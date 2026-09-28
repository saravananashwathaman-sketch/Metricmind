"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Activity,
  Award,
  Layers,
  Database,
  History,
  Lock,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileCode,
  ListFilter
} from "lucide-react";
import { FirewallStatusBanner } from "@/components/firewall/FirewallStatusBanner";
import { FirewallKPIsCard } from "@/components/firewall/FirewallKPIsCard";
import { FirewallRequestInspector } from "@/components/firewall/FirewallRequestInspector";
import { FirewallTestLab } from "@/components/firewall/FirewallTestLab";
import { FirewallAuditTable } from "@/components/firewall/FirewallAuditTable";
import {
  INITIAL_FIREWALL_KPIS,
  APPROVED_METRICS_LIST,
  APPROVED_DIMENSIONS_LIST,
  RESTRICTED_ENTITIES,
  PROHIBITED_DATA_SOURCES
} from "@/lib/firewallEngine";
import { APPROVED_MEASURES, APPROVED_DIMENSIONS } from "@/lib/semanticSchema";

export const FirewallDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inspector" | "test-lab" | "audit" | "catalog">("inspector");

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Page Header (Requirement 21 & 35) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-slate-800 to-indigo-500/20 border border-rose-500/30 text-rose-400 shadow-xl shadow-rose-500/10">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
                AI Hallucination Firewall
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                &quot;Every AI-generated analytical request is validated before reaching the semantic layer.&quot;
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-300 font-bold">ZERO-TRUST ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Prominent Firewall Status Card (Requirement 22) */}
      <FirewallStatusBanner />

      {/* Top KPI Cards (Requirement 21) */}
      <FirewallKPIsCard kpis={INITIAL_FIREWALL_KPIS} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("inspector")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "inspector"
              ? "bg-sky-500/20 text-sky-200 border border-sky-500/30 shadow-lg shadow-sky-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Real-Time Request Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab("test-lab")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "test-lab"
              ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Automated Test Lab</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "audit"
              ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <History className="w-4 h-4 text-indigo-400" />
          <span>Firewall Audit Log</span>
        </button>

        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "catalog"
              ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
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
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                Approved Measures Allowlist ({APPROVED_MEASURES.length})
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Cube Sales.yml
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {APPROVED_MEASURES.map((m) => (
                <div
                  key={m.name}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{m.display_name}</span>
                    <span className="font-mono text-[10px] text-sky-400">{m.technical_name}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">Formula: {m.formula}</div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Version: {m.version}</span>
                    <span className="text-emerald-400 font-bold">STATUS: {m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approved Dimensions */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Approved Dimensions Allowlist ({APPROVED_DIMENSIONS.length})
              </h3>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                Categorical / Geo
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {APPROVED_DIMENSIONS.map((d) => (
                <div
                  key={d.name}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{d.display_name}</span>
                    <span className="font-mono text-[10px] text-indigo-400">{d.cube}.{d.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{d.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Sample Domain: {d.sample_values.slice(0, 4).join(", ")}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RBAC & Restricted Entities */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                Restricted Data Entities (RBAC Blocked)
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                Strict Firewall Rule
              </span>
            </div>
            <p className="text-xs text-slate-400">
              The following entities are strictly protected and cannot be retrieved by unauthorized analyst roles or standard executive queries:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {RESTRICTED_ENTITIES.map((ent, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 font-mono text-rose-300 text-xs"
                >
                  {ent}
                </span>
              ))}
            </div>
          </div>

          {/* Prohibited Raw Data Sources */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                Prohibited Raw Data Sources (Zero SQL)
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                Direct SQL Prohibited
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct SQL access or warehouse table targets are intercepted. The AI agent only accesses certified semantic cubes:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {PROHIBITED_DATA_SOURCES.map((src, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 font-mono text-amber-300 text-xs"
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
