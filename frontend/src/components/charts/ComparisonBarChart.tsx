"use client";

import React, { useMemo } from "react";
import { EChartWrapper } from "./EChartWrapper";
import * as echarts from "echarts";

export interface ComparisonBarChartProps {
  categories: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  height?: string;
  horizontal?: boolean;
  unit?: string;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  categories,
  series,
  height = "350px",
  horizontal = false,
  unit = "%"
}) => {
  const option = useMemo<echarts.EChartsOption>(() => {
    // Elegant enterprise financial palette:
    // Q1 2026: Slate steel blue (#64748b -> #475569)
    // Q2 2026: Vibrant enterprise cyan/sky (#38bdf8 -> #0284c7)
    const colorGradients = [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#94a3b8" },
        { offset: 1, color: "#475569" }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#38bdf8" },
        { offset: 1, color: "#0284c7" }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#34d399" },
        { offset: 1, color: "#059669" }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#f59e0b" },
        { offset: 1, color: "#d97706" }
      ])
    ];

    const hoverColors = ["#cbd5e1", "#7dd3fc", "#6ee7b7", "#fcd34d"];

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(56, 189, 248, 0.05)"
          }
        },
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderWidth: 1,
        borderRadius: 12,
        padding: [12, 16],
        extraCssText:
          "backdrop-filter: blur(14px); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.12);",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const catName = params[0].name;

          let q1Val: number | null = null;
          let q2Val: number | null = null;

          params.forEach((p: any) => {
            if (p.seriesName.includes("Q1")) q1Val = p.value;
            if (p.seriesName.includes("Q2")) q2Val = p.value;
          });

          // Calculate delta if comparing Q1 and Q2
          let deltaHtml = "";
          if (q1Val !== null && q2Val !== null) {
            const diff = Number((q2Val - q1Val).toFixed(1));
            const isPos = diff >= 0;
            const sign = isPos ? "+" : "";
            const statusLabel = isPos ? "Expansion" : "Contraction";
            const badgeClass = isPos
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/15 text-rose-400 border border-rose-500/30";

            deltaHtml = `
              <div class="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span class="text-slate-400 text-[11px]">Net Change:</span>
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full ${badgeClass}">
                  ${sign}${diff} pp (${statusLabel})
                </span>
              </div>
            `;
          }

          const seriesRows = params
            .map((p: any) => {
              const dotColor =
                p.seriesIndex === 0 ? "#94a3b8" : "#38bdf8";
              return `
                <div class="flex items-center justify-between text-xs gap-4">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" style="background-color: ${dotColor};"></span>
                    <span class="text-slate-300">${p.seriesName}:</span>
                  </div>
                  <span class="font-mono font-bold text-slate-100">${p.value}${unit}</span>
                </div>
              `;
            })
            .join("");

          return `
            <div class="space-y-1.5 min-w-[190px]">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Theater Performance</div>
              <div class="text-sm font-black text-slate-100">${catName}</div>
              <div class="space-y-1 pt-1">
                ${seriesRows}
              </div>
              ${deltaHtml}
            </div>
          `;
        }
      },
      legend: {
        data: series.map((s) => s.name),
        textStyle: {
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: "normal" as const
        },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 14,
        icon: "circle",
        top: "2%",
        right: "3%"
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "10%",
        top: "14%",
        containLabel: true
      },
      xAxis: horizontal
        ? {
            type: "value",
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              lineStyle: { color: "rgba(255, 255, 255, 0.05)", type: "dashed" }
            },
            axisLabel: { color: "#64748b", fontSize: 11, formatter: `{value}${unit}` }
          }
        : {
            type: "category",
            data: categories,
            axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.12)" } },
            axisTick: { show: false },
            axisLabel: {
              color: "#94a3b8",
              fontSize: 11,
              fontWeight: "normal" as const,
              margin: 12
            }
          },
      yAxis: horizontal
        ? {
            type: "category",
            data: categories,
            axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.12)" } },
            axisTick: { show: false },
            axisLabel: { color: "#94a3b8", fontSize: 11 }
          }
        : {
            type: "value",
            min: 0,
            max: (val) => Math.ceil(val.max + 5),
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              lineStyle: { color: "rgba(255, 255, 255, 0.05)", type: "dashed" }
            },
            axisLabel: {
              color: "#64748b",
              fontSize: 11,
              formatter: `{value}${unit}`
            }
          },
      series: series.map((s, idx) => {
        const isQ1 = s.name.includes("Q1") || idx === 0;
        const barGradient = colorGradients[idx % colorGradients.length];
        const hoverColor = hoverColors[idx % hoverColors.length];

        return {
          name: s.name,
          type: "bar",
          barMaxWidth: 26,
          barGap: "20%",
          label: {
            show: true,
            position: "top",
            offset: [0, -3],
            formatter: (p: any) => `${p.value}${unit}`,
            color: isQ1 ? "#94a3b8" : "#7dd3fc",
            fontWeight: "bold",
            fontSize: 10
          },
          itemStyle: {
            color: barGradient,
            borderRadius: horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: hoverColor,
              shadowColor: isQ1
                ? "rgba(148, 163, 184, 0.3)"
                : "rgba(56, 189, 248, 0.4)",
              shadowBlur: 10
            }
          },
          data: s.data
        };
      })
    };
  }, [categories, series, horizontal, unit]);

  return <EChartWrapper option={option} height={height} />;
};
