"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Filter,
  Layers,
  Database,
  Calendar,
  FileCode
} from "lucide-react";
import { ChangeType, MetricImpactMetadata } from "@/types/impact";
import { IMPACT_METRICS_CATALOG } from "@/lib/impactSimulator";

interface DefinitionEditorProps {
  metric: MetricImpactMetadata;
  changeType: ChangeType;
  onChangeType: (type: ChangeType) => void;
  proposedFormula: string;
  onFormulaChange: (formula: string) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
  onReset: () => void;
}

export const DefinitionEditor: React.FC<DefinitionEditorProps> = ({
  metric,
  changeType,
  onChangeType,
  proposedFormula,
  onFormulaChange,
  onRunSimulation,
  isRunning,
  onReset
}) => {
  const changeTypeOptions: { id: ChangeType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "formula_change",
      label: "Formula Change",
      icon: <Code2 className="w-3.5 h-3.5" />,
      desc: "Modify mathematical operands or measures"
    },
    {
      id: "filter_change",
      label: "Filter Change",
      icon: <Filter className="w-3.5 h-3.5" />,
      desc: "Change row filtering criteria"
    },
    {
      id: "dimension_change",
      label: "Dimension Change",
      icon: <Layers className="w-3.5 h-3.5" />,
      desc: "Change analytical grouping grain"
    },
    {
      id: "data_source_change",
      label: "Data Source Change",
      icon: <Database className="w-3.5 h-3.5" />,
      desc: "Switch upstream mart or table"
    },
    {
      id: "business_rule_change",
      label: "Business Rule",
      icon: <Sliders className="w-3.5 h-3.5" />,
      desc: "Adjust revenue recognition or policy"
    },
    {
      id: "time_logic_change",
      label: "Time Logic Change",
      icon: <Calendar className="w-3.5 h-3.5" />,
      desc: "Calendar vs Fiscal quarter periods"
    }
  ];

  // Quick preset shortcuts based on change type
  const presets: { label: string; formula: string; type: ChangeType; note: string }[] = [
    {
      label: "Include Dedicated Logistics Cost",
      formula: "((Revenue - Cost - Logistics Cost) / Revenue) * 100",
      type: "formula_change",
      note: "Standard logistics freight deduction scenario (-4.32 pp)"
    },
    {
      label: "ASC 606 Adjusted COGS",
      formula: "((Revenue - Adjusted Cost) / Revenue) * 100",
      type: "formula_change",
      note: "Normalizes carrier fuel indexation under ASC 606 (-1.0 pp)"
    },
    {
      label: "Include Partial Orders (Filter)",
      formula: "((Revenue - Cost) / Revenue) * 100",
      type: "filter_change",
      note: "Completed + partially fulfilled commercial orders"
    },
    {
      label: "Trigger Governance Block (Unknown Measure)",
      formula: "((Revenue - Cost - shipping_cost_v2) / Revenue) * 100",
      type: "formula_change",
      note: "Tests semantic protection blocker for unapproved measure"
    }
  ];

  const handleApplyPreset = (preset: (typeof presets)[0]) => {
    onChangeType(preset.type);
    onFormulaChange(preset.formula);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Section 4 & 5
            </span>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              Proposed Definition Editor
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Specify the mathematical, dimensional, or filtering alteration to simulate across downstream BI assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Change Type Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Simulation Change Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {changeTypeOptions.map((opt) => {
            const isActive = changeType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChangeType(opt.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isActive
                    ? "bg-sky-500/15 border-sky-500/60 text-sky-200 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className={isActive ? "text-sky-400" : "text-slate-400"}>{opt.icon}</span>
                  <span className="truncate">{opt.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid: Current vs Proposed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CURRENT DEFINITION (Read Only) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Current Governed Definition (v{metric.current_version})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Active Production
              </span>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-slate-800/80 font-mono text-xs text-emerald-300 selection:bg-emerald-500/20">
              {metric.formula}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Owner: <strong className="text-slate-300">{metric.owner}</strong></span>
            <span>Grain: <code className="text-sky-400">Quarter × Region</code></span>
          </div>
        </div>

        {/* PROPOSED DEFINITION (Editable) */}
        <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/40 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Proposed Change (Draft Simulation)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 font-bold">
                Sandbox Mode
              </span>
            </div>

            <textarea
              rows={3}
              value={proposedFormula}
              onChange={(e) => onFormulaChange(e.target.value)}
              placeholder="Enter proposed formula e.g. ((Revenue - Cost - Logistics Cost) / Revenue) * 100"
              className="w-full p-3 rounded-lg bg-black/80 border border-sky-500/40 font-mono text-xs text-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Supported measures: <code className="text-slate-300">Revenue, Cost, Logistics Cost, OPEX</code></span>
            <span className="text-amber-400 font-mono text-[10px]">Read-Only Sandbox</span>
          </div>
        </div>
      </div>

      {/* Quick Test Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Simulation Scenarios
          </span>
          <span className="text-[10px] text-slate-500">Click to apply test case</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="font-medium">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-sky-400" />
          <span>Simulations are executed deterministically in memory. Production data remains immutable.</span>
        </div>

        <button
          onClick={onRunSimulation}
          disabled={isRunning || !proposedFormula.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600 hover:from-sky-400 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Downstream DAG...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run Simulation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
