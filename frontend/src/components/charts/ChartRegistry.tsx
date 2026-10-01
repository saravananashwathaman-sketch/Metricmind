"use client";

import React from "react";
import * as echarts from "echarts";
import { EChartWrapper } from "./EChartWrapper";
import { VisualizationPayload } from "@/types";
import { WaterfallChart } from "./WaterfallChart";
import { TrendingDown, TrendingUp, Sparkles, Activity } from "lucide-react";

interface ChartRegistryProps {
  visualization: VisualizationPayload;
  height?: string | number;
}

/**
 * MetricMind ECharts Color Palette
 */
const METRICMIND_PALETTE = [
  "#38bdf8", // Sky blue
  "#818cf8", // Indigo
  "#34d399", // Emerald
  "#fbbf24", // Amber
  "#f87171", // Rose
  "#a78bfa", // Purple
  "#2dd4bf"  // Teal
];

export const ChartRegistry: React.FC<ChartRegistryProps> = ({
  visualization,
  height = "320px"
}) => {
  const { type, title, subtitle, data, xAxis, yAxis, unit } = visualization;
  const chartHeight = typeof height === "number" ? `${height}px` : height;

  // 1. WATERFALL (Contribution / Driver Decomposition)
  if (type === "waterfall") {
    return <WaterfallChart data={data} height={chartHeight} unit={unit || "%"} />;
  }

  // 2. SINGLE KPI CARD
  if (type === "kpi") {
    const kpiItem = data[0] || {};
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {kpiItem.label || title}
        </span>
        <div className="text-3xl sm:text-4xl font-black text-slate-100 mt-2 font-mono tracking-tight">
          {kpiItem.current}
        </div>
        {kpiItem.baseline && (
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-400">
            <span>Baseline: {kpiItem.baseline}</span>
            {kpiItem.change && (
              <span
                className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                  String(kpiItem.change).includes("-")
                    ? "bg-rose-500/10 text-rose-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {kpiItem.change}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. MULTI-METRIC KPI GRID
  if (type === "kpi_grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">
              {item.label || item.name}
            </span>
            <div className="text-lg font-bold text-slate-100 font-mono">{item.value}</div>
            {item.change && (
              <span className="text-[10px] text-slate-400 font-mono block">{item.change}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 4. LINE CHART (Time Series)
  if (type === "line") {
    const xKey = xAxis || "period";
    const yKey = yAxis || Object.keys(data[0] || {}).find((k) => k !== xKey) || "value";

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: (params: any) => {
          const item = Array.isArray(params) ? params[0] : params;
          return `<div class="font-sans">
            <div class="text-xs text-slate-400">${item.name}</div>
            <div class="text-sm font-bold text-sky-400">${item.seriesName}: ${item.value} ${unit || ""}</div>
          </div>`;
        }
      },
      grid: { left: "4%", right: "4%", bottom: "10%", top: "15%", containLabel: true },
      xAxis: {
        type: "category",
        data: data.map((d) => d[xKey]),
        axisLine: { lineStyle: { color: "#334155" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 }
      },
      series: [
        {
          name: title || "Metric Value",
          type: "line",
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { color: "#38bdf8", width: 3 },
          itemStyle: { color: "#38bdf8" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(56, 189, 248, 0.25)" },
              { offset: 1, color: "rgba(56, 189, 248, 0.0)" }
            ])
          },
          data: data.map((d) => d[yKey])
        }
      ]
    };

    return <EChartWrapper option={option} height={height} />;
  }

  // 5. BAR CHART (Category Comparison)
  if (type === "bar") {
    const xKey = xAxis || "category";
    const yKey = yAxis || "value";
    const hasPrevious = data.some((d) => d.previous !== undefined);

    const series: any[] = [
      {
        name: "Current Period",
        type: "bar",
        barMaxWidth: 30,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#38bdf8" },
            { offset: 1, color: "#0284c7" }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        data: data.map((d) => d[yKey] ?? d.value)
      }
    ];

    if (hasPrevious) {
      series.push({
        name: "Previous Period",
        type: "bar",
        barMaxWidth: 30,
        itemStyle: {
          color: "#475569",
          borderRadius: [4, 4, 0, 0]
        },
        data: data.map((d) => d.previous)
      });
    }

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc", fontSize: 12 }
      },
      legend: hasPrevious
        ? {
            data: ["Current Period", "Previous Period"],
            textStyle: { color: "#94a3b8", fontSize: 11 },
            top: 0
          }
        : undefined,
      grid: { left: "4%", right: "4%", bottom: "10%", top: hasPrevious ? "20%" : "12%", containLabel: true },
      xAxis: {
        type: "category",
        data: data.map((d) => d[xKey]),
        axisLine: { lineStyle: { color: "#334155" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 }
      },
      series
    };

    return <EChartWrapper option={option} height={height} />;
  }

  // 6. HORIZONTAL BAR CHART (Geographical Comparison)
  if (type === "horizontal_bar") {
    const yKey = yAxis || "country";
    const xKey = xAxis || "value";

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc", fontSize: 12 }
      },
      grid: { left: "4%", right: "6%", bottom: "6%", top: "8%", containLabel: true },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 }
      },
      yAxis: {
        type: "category",
        data: data.map((d) => d[yKey] || d.name || "Region"),
        axisLine: { lineStyle: { color: "#334155" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 }
      },
      series: [
        {
          name: title || "Metric Value",
          type: "bar",
          barMaxWidth: 24,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#6366f1" },
              { offset: 1, color: "#38bdf8" }
            ]),
            borderRadius: [0, 4, 4, 0]
          },
          data: data.map((d) => d[xKey] ?? d.value)
        }
      ]
    };

    return <EChartWrapper option={option} height={height} />;
  }

  // 7. DONUT / PIE (Part-to-Whole)
  if (type === "donut" || type === "pie") {
    const isDonut = type === "donut";
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "center",
        textStyle: { color: "#94a3b8", fontSize: 11 }
      },
      color: METRICMIND_PALETTE,
      series: [
        {
          name: title || "Share",
          type: "pie",
          radius: isDonut ? ["42%", "72%"] : "70%",
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: isDonut ? 4 : 0,
            borderColor: "#090d16",
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 12, fontWeight: "bold", color: "#f8fafc" }
          },
          data: data.map((d) => ({ name: d.name || d.category || d.label, value: d.value }))
        }
      ]
    };

    return <EChartWrapper option={option} height={height} />;
  }

  // 8. SCATTER PLOT (Correlation)
  if (type === "scatter") {
    const xKey = xAxis || "x";
    const yKey = yAxis || "y";

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: (params: any) => `[${params.value[0]}, ${params.value[1]}]`
      },
      grid: { left: "5%", right: "5%", bottom: "10%", top: "10%", containLabel: true },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
        axisLabel: { color: "#94a3b8" }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
        axisLabel: { color: "#94a3b8" }
      },
      series: [
        {
          type: "scatter",
          symbolSize: 12,
          itemStyle: { color: "#38bdf8" },
          data: data.map((d) => [d[xKey], d[yKey]])
        }
      ]
    };

    return <EChartWrapper option={option} height={height} />;
  }

  // Fallback if unsupported type
  return (
    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
      Visualization unavailable for this result.
    </div>
  );
};
