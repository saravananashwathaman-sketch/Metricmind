"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Sliders, BarChart3, TrendingDown, Layers, Plus, Check } from "lucide-react";
import { WhatIfScenarioItem } from "@/types/impact";

// Dynamically import echarts-for-react to prevent SSR hydration errors
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

interface ScenarioComparisonProps {
  scenarios: WhatIfScenarioItem[];
  metricUnit?: string;
  onAddCustomScenario?: (name: string, simulatedValue: number) => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  metricUnit = "%",
  onAddCustomScenario
}) => {
  const [activeScenarios, setActiveScenarios] = useState<WhatIfScenarioItem[]>(scenarios);
  const [customName, setCustomName] = useState("");
  const [customVal, setCustomVal] = useState("25.0");
  const [showAddForm, setShowAddForm] = useState(false);

  // ECharts Option
  const chartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#020617",
      borderColor: "#334155",
      textStyle: { color: "#f8fafc", fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        return `<div class="p-1"><strong>${item.name}</strong><br/>Metric Value: <span style="color:#38bdf8;font-weight:bold">${item.value}${metricUnit}</span></div>`;
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "12%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: activeScenarios.map((s) => s.name.replace("Scenario ", "Scen ")),
      axisLabel: { color: "#94a3b8", fontSize: 10, interval: 0, rotate: 12 },
      axisLine: { lineStyle: { color: "#334155" } }
    },
    yAxis: {
      type: "value",
      min: 20,
      max: 32,
      axisLabel: { color: "#94a3b8", fontSize: 11, formatter: `{value}${metricUnit}` },
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } }
    },
    series: [
      {
        name: "Simulated Metric",
        type: "bar",
        barWidth: "40%",
        data: activeScenarios.map((s, idx) => ({
          value: s.simulated_value,
          itemStyle: {
            color:
              idx === 0
                ? "#10b981" // Baseline green
                : s.name.includes("Proposed")
                ? "#38bdf8" // Proposed sky
                : "#6366f1", // Scenarios indigo
            borderRadius: [6, 6, 0, 0]
          }
        })),
        label: {
          show: true,
          position: "top",
          formatter: `{c}${metricUnit}`,
          color: "#e2e8f0",
          fontSize: 11,
          fontWeight: "bold"
        }
      }
    ]
  };

  const handleAdd = () => {
    if (!customName.trim()) return;
    const val = parseFloat(customVal);
    if (isNaN(val)) return;

    const baseVal = activeScenarios[0]?.current_value || 27.2;
    const newScen: WhatIfScenarioItem = {
      id: `custom_${Date.now()}`,
      name: customName,
      description: `Custom scenario: ${customName}`,
      parameter: customName,
      parameter_delta: `${(val - baseVal).toFixed(2)} pp`,
      current_value: baseVal,
      simulated_value: val,
      difference_pp: Math.round((val - baseVal) * 100) / 100,
      is_active: true
    };

    setActiveScenarios([...activeScenarios, newScen]);
    setCustomName("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Section 16 & 17 • What-If Multi-Scenario Modeling
          </span>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            What-If Scenario Comparison & Sensitivity Forecast
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare multiple sensitivity variations without ranking them as best/worst. Analytically neutral forecast.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-sky-400" />
          <span>Add Custom Scenario</span>
        </button>
      </div>

      {/* Add Custom Scenario Form */}
      {showAddForm && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/40 space-y-3 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-sky-400">Configure Custom Sensitivity Scenario</span>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Scenario Name (e.g. Fuel Spike +15%)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-black/60 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Simulated Margin %"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              className="w-36 px-3 py-1.5 text-xs bg-black/60 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors"
            >
              Add Scenario
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side: Chart & Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* ECharts Visualization */}
        <div className="lg:col-span-6 h-64 rounded-xl bg-black/40 border border-slate-800/80 p-2 flex items-center justify-center">
          <ReactECharts
            option={chartOption}
            style={{ height: "100%", width: "100%" }}
            notMerge={true}
          />
        </div>

        {/* Comparison Neutral Table */}
        <div className="lg:col-span-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Scenario</th>
                <th className="py-2.5 px-3">Simulated Value</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Parameter Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {activeScenarios.map((scen, idx) => (
                <tr key={scen.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          idx === 0 ? "bg-emerald-400" : "bg-sky-400"
                        }`}
                      />
                      <span>{scen.name}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-100">
                    {scen.simulated_value.toFixed(1)}{metricUnit}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span
                      className={
                        scen.difference_pp === 0
                          ? "text-slate-500"
                          : scen.difference_pp > 0
                          ? "text-emerald-400"
                          : "text-slate-300"
                      }
                    >
                      {scen.difference_pp > 0
                        ? `+${scen.difference_pp.toFixed(1)} pp`
                        : `${scen.difference_pp.toFixed(1)} pp`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate">
                    {scen.parameter}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
