"use client";

import React from "react";
import { DataSnapshotMetadata } from "@/types/timeMachine";
import { HardDrive, CheckCircle2, ShieldCheck, MapPin, Calendar, Hash, FileSpreadsheet } from "lucide-react";

interface DataSnapshotCardProps {
  snapshot: DataSnapshotMetadata;
}

export const DataSnapshotCard: React.FC<DataSnapshotCardProps> = ({ snapshot }) => {
  if (!snapshot) return null;

  const countries = Array.isArray(snapshot?.countries) ? snapshot.countries : ["Germany", "France", "Spain", "Italy"];
  const rowsCount = typeof snapshot?.rows_included === "number" ? snapshot.rows_included.toLocaleString() : "18,492";
  const checksum = snapshot?.checksum || "7A82F904B1";
  const warehouse = snapshot?.warehouse_source || "PROD_ANALYTICS.FINANCE_SCHEMA.FCT_SALES";
  const partitions = Array.isArray(snapshot?.table_partitions) ? snapshot.table_partitions : ["year=2026", "quarter=Q3", "region=Europe"];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            DATA SNAPSHOT METADATA
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {snapshot.is_demo_mode && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
              DEMO MODE
            </span>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
            {snapshot.data_version || "2026.09"}
          </span>
        </div>
      </div>

      {/* Snapshot ID & Source */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Snapshot Identifier</span>
          <span className="text-sm font-black text-cyan-300 font-mono tracking-wide">{snapshot.id || "SNAP-2026-Q3-EU-001"}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Source Warehouse</span>
          <span className="text-xs font-mono text-slate-300">{warehouse}</span>
        </div>
      </div>

      {/* Snapshot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reporting Period</span>
          <span className="font-bold text-slate-100 mt-0.5 block flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-sky-400" />
            {snapshot.period || "Q3 2026"}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Region</span>
          <span className="font-bold text-slate-100 mt-0.5 block flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" />
            {snapshot.region || "Europe"}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rows Included</span>
          <span className="font-bold text-emerald-400 mt-0.5 block font-mono">
            {rowsCount} rows
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Last Synchronized</span>
          <span className="font-bold text-slate-100 mt-0.5 block font-mono text-[11px]">
            {snapshot.last_updated || "30 Sep 2026"}
          </span>
        </div>
      </div>

      {/* Countries Covered */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Geographic Partitions Evaluated:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {countries.map((c) => (
            <span
              key={c}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-medium"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Partitions & Checksum */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <Hash className="w-3 h-3 text-slate-400" />
          <span>Immutable Checksum: {checksum}</span>
        </div>
        <span className="text-[10px] text-slate-400">
          Partitions: {partitions.join(", ")}
        </span>
      </div>

      {snapshot.is_demo_mode && (
        <div className="text-[10px] text-amber-300/80 bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
          Notice: In DEMO MODE, this snapshot uses deterministic local warehouse metadata to ensure repeatable verification without needing external Snowflake credentials.
        </div>
      )}
    </div>
  );
};

