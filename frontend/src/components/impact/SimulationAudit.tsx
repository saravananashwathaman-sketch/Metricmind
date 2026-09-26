"use client";

import React, { useState } from "react";
import { History, ShieldCheck, User, Clock, CheckCircle2, Search, ArrowUpRight } from "lucide-react";
import { SimulationAuditRecord } from "@/types/impact";

interface SimulationAuditProps {
  auditTrail: SimulationAuditRecord[];
  onSelectAuditRecord?: (record: SimulationAuditRecord) => void;
}

export const SimulationAudit: React.FC<SimulationAuditProps> = ({
  auditTrail,
  onSelectAuditRecord
}) => {
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = auditTrail.filter(
    (item) =>
      item.simulation_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.metric_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.user_name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 23 • Simulation Audit Trail
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            Immutable Simulation Audit Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every simulation execution is stamped with a cryptographic simulation ID and user identity.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search simulation ID or user..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Simulation ID</th>
              <th className="py-2.5 px-3">Metric</th>
              <th className="py-2.5 px-3">Initiated By</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Simulated Value</th>
              <th className="py-2.5 px-3">Affected Assets</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filtered.map((item) => (
              <tr
                key={item.simulation_id}
                onClick={() => onSelectAuditRecord && onSelectAuditRecord(item)}
                className="hover:bg-slate-900/50 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 font-mono font-bold text-sky-400 flex items-center gap-1.5">
                  <span>{item.simulation_id}</span>
                </td>
                <td className="py-2.5 px-3 font-medium text-slate-200">
                  {item.metric_name} ({item.current_version})
                </td>
                <td className="py-2.5 px-3 text-slate-300">
                  <span>{item.user_name}</span>
                  <span className="text-[10px] text-slate-500 block">{item.user_role}</span>
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">
                  {item.timestamp}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-100">
                  {item.simulated_value.toFixed(1)}%{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({item.difference_pp > 0 ? `+${item.difference_pp}` : item.difference_pp} pp)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-300">
                  {item.affected_assets_count} assets
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : item.status === "Under Review"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
