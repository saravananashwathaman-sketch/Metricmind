"use client";

import React, { useState } from "react";
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Lock,
  ArrowUpDown
} from "lucide-react";
import { FirewallAuditLogEntry } from "@/types/firewall";
import { INITIAL_FIREWALL_AUDIT_LOGS } from "@/lib/firewallEngine";
import { FirewallDetailsModal } from "./FirewallDetailsModal";

export const FirewallAuditTable: React.FC = () => {
  const [logs] = useState<FirewallAuditLogEntry[]>(INITIAL_FIREWALL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PASSED" | "BLOCKED">("ALL");
  const [selectedEntry, setSelectedEntry] = useState<FirewallAuditLogEntry | null>(null);

  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resolved_metric.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.firewall_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Firewall Audit Trail & Request History
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of all AI requests, detected violations, permission checks, and Cube.dev gateway authorizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts or request ID..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 w-48 sm:w-60"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(["ALL", "PASSED", "BLOCKED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-slate-800 text-slate-100 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Request ID</th>
              <th className="py-3 px-3">User & Role</th>
              <th className="py-3 px-4">Original Prompt</th>
              <th className="py-3 px-3">Resolved Metric</th>
              <th className="py-3 px-3">Firewall Status</th>
              <th className="py-3 px-3">Raw SQL</th>
              <th className="py-3 px-3">Permission</th>
              <th className="py-3 px-3">Cube API</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredLogs.map((log) => {
              const isPassed = log.firewall_status === "PASSED";
              return (
                <tr
                  key={log.request_id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedEntry(log)}
                >
                  <td className="py-3 px-3 font-mono text-[11px] text-sky-400 font-bold">
                    {log.request_id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{log.user}</div>
                    <div className="text-[10px] text-slate-500">{log.user_role}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate" title={log.question}>
                    &quot;{log.question}&quot;
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs text-indigo-300">{log.resolved_metric}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isPassed
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{log.firewall_status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        log.sql_detected === "NONE" ? "text-slate-400" : "text-rose-400"
                      }`}
                    >
                      {log.sql_detected}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        log.permission_check === "PASSED" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {log.permission_check}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        log.cube_request_sent === "SENT" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {log.cube_request_sent}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntry(log);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <FirewallDetailsModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
};
