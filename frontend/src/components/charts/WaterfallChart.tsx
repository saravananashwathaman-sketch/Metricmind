"use client";

import React, { useMemo } from "react";
import { EChartWrapper } from "./EChartWrapper";
import * as echarts from "echarts";

export interface WaterfallItem {
  name: string;
  fullName?: string;
  value: number;
  is_total?: boolean;
}

interface WaterfallChartProps {
  data: WaterfallItem[];
  height?: string;
  unit?: string;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  height = "350px",
  unit = "%"
}) => {
  const option = useMemo<echarts.EChartsOption>(() => {
    // Map short clean names for X-Axis to prevent any label overlapping
    const shortLabelMap: Record<string, string> = {
      "q1 2026 margin": "Q1 Margin",
      "q1 2026 baseline": "Q1 Margin",
      "q1 margin": "Q1 Margin",
      "logistics surge": "Logistics",
      "logistics & freight surge": "Logistics",
      "logistics": "Logistics",
      "raw materials cogs": "Raw Materials",
      "raw materials cost": "Raw Materials",
      "raw materials": "Raw Materials",
      "cogs": "COGS",
      "cloud bandwidth": "Cloud",
      "cloud": "Cloud",
      "field ops drag": "Field Ops",
      "field operations drag": "Field Ops",
      "field ops": "Field Ops",
      "spain drag": "Spain",
      "germany drag": "Germany",
      "france drag": "France",
      "italy drag": "Italy",
      "q2 2026 margin": "Q2 Margin",
      "q2 2026 european margin": "Q2 Margin",
      "q2 margin": "Q2 Margin"
    };

    const categories: string[] = [];
    const baseData: number[] = [];
    const positiveData: number[] = [];
    const negativeData: number[] = [];
    const totalData: number[] = [];
    const connectorLineData: (number | null)[] = [];

    // Track transitions for rich tooltips: [prevMargin, currentMargin, impact]
    const stepMetadata: {
      fullName: string;
      prevMargin: number;
      currMargin: number;
      delta: number;
      isTotal: boolean;
    }[] = [];

    let currentAccumulator = 0;
    let minVal = 999;
    let maxVal = -999;

    data.forEach((item, index) => {
      const lower = item.name.toLowerCase().trim();
      const shortName = item.name.includes("\n")
        ? item.name
        : shortLabelMap[lower] || item.name;
      categories.push(shortName);

      const fullName = item.fullName || item.name;

      if (index === 0 || item.is_total) {
        // Pillar bar (Starting or Ending total)
        baseData.push(0);
        positiveData.push(0);
        negativeData.push(0);
        totalData.push(Number(item.value.toFixed(2)));

        stepMetadata.push({
          fullName,
          prevMargin: item.value,
          currMargin: item.value,
          delta: item.value,
          isTotal: true
        });

        connectorLineData.push(item.value);
        currentAccumulator = item.value;
      } else {
        totalData.push(0);
        const prev = currentAccumulator;

        if (item.value >= 0) {
          baseData.push(Number(prev.toFixed(2)));
          positiveData.push(Number(item.value.toFixed(2)));
          negativeData.push(0);
          currentAccumulator += item.value;
        } else {
          const absVal = Math.abs(item.value);
          currentAccumulator -= absVal;
          baseData.push(Number(currentAccumulator.toFixed(2)));
          positiveData.push(0);
          negativeData.push(Number(absVal.toFixed(2)));
        }

        stepMetadata.push({
          fullName,
          prevMargin: Number(prev.toFixed(1)),
          currMargin: Number(currentAccumulator.toFixed(1)),
          delta: item.value,
          isTotal: false
        });

        // Connector level tracks the departure level
        connectorLineData.push(Number(currentAccumulator.toFixed(2)));
      }

      minVal = Math.min(minVal, currentAccumulator, item.value);
      maxVal = Math.max(maxVal, currentAccumulator, item.value);
    });

    // Dynamic yAxis bounds so bars are prominent with ample vertical room for data labels
    const yAxisMin = Math.max(0, Math.floor(minVal - 5));
    const yAxisMax = Math.ceil(maxVal + 4);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderWidth: 1,
        borderRadius: 12,
        padding: [12, 16],
        extraCssText:
          "backdrop-filter: blur(14px); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.12);",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: (params: any) => {
          const dataIndex = params[0]?.dataIndex ?? 0;
          const meta = stepMetadata[dataIndex];
          if (!meta) return "";

          const isNegative = meta.delta < 0;
          const sign = meta.delta > 0 && !meta.isTotal ? "+" : "";

          if (meta.isTotal) {
            return `
              <div class="space-y-1.5 min-w-[170px]">
                <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Governed Milestone</div>
                <div class="text-sm font-black text-slate-100">${meta.fullName}</div>
                <div class="pt-1.5 mt-1 border-t border-slate-800 flex items-center justify-between">
                  <span class="text-slate-400 text-xs">Margin Level:</span>
                  <span class="text-sky-400 font-mono font-bold text-sm">${meta.currMargin}${unit}</span>
                </div>
              </div>
            `;
          }

          return `
            <div class="space-y-2 min-w-[190px]">
              <div class="text-sm font-black text-slate-100">${meta.fullName}</div>
              <div class="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-400">Impact:</span>
                  <span class="font-mono font-bold ${isNegative ? "text-rose-400" : "text-emerald-400"}">
                    ${sign}${meta.delta} pp
                  </span>
                </div>
                <div class="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Previous Margin:</span>
                  <span class="font-mono text-slate-300 font-semibold">${meta.prevMargin}${unit}</span>
                </div>
                <div class="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Current Margin:</span>
                  <span class="font-mono text-slate-100 font-bold">${meta.currMargin}${unit}</span>
                </div>
              </div>
            </div>
          `;
        }
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "10%",
        top: "14%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.12)" } },
        axisTick: { show: false },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: "normal" as const,
          interval: 0,
          rotate: 0,
          margin: 12
        }
      },
      yAxis: {
        type: "value",
        min: yAxisMin,
        max: yAxisMax,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.05)",
            type: "dashed"
          }
        },
        axisLabel: {
          color: "#64748b",
          fontSize: 11,
          formatter: `{value}${unit}`
        }
      },
      series: [
        // 1. Transparent Placeholder Bar
        {
          name: "Placeholder",
          type: "bar",
          stack: "Total",
          barMaxWidth: 44,
          itemStyle: { borderColor: "transparent", color: "transparent" },
          emphasis: { itemStyle: { borderColor: "transparent", color: "transparent" } },
          data: baseData
        },
        // 2. Positive Contributors
        {
          name: "Positive Impact",
          type: "bar",
          stack: "Total",
          barMaxWidth: 44,
          barMinHeight: 16,
          label: {
            show: true,
            position: "top",
            offset: [0, -3],
            formatter: (p: any) => (p.value > 0 ? `+${p.value}${unit}` : ""),
            color: "#34d399",
            fontWeight: "bold",
            fontSize: 11
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#10b981" },
              { offset: 1, color: "#059669" }
            ]),
            borderRadius: [4, 4, 4, 4]
          },
          emphasis: {
            itemStyle: {
              color: "#34d399",
              shadowColor: "rgba(16, 185, 129, 0.4)",
              shadowBlur: 10
            }
          },
          data: positiveData
        },
        // 3. Negative Drag Drivers
        {
          name: "Negative Drag",
          type: "bar",
          stack: "Total",
          barMaxWidth: 44,
          barMinHeight: 16,
          label: {
            show: true,
            position: "top",
            offset: [0, -3],
            formatter: (p: any) => (p.value > 0 ? `-${p.value}${unit}` : ""),
            color: "#fb7185",
            fontWeight: "bold",
            fontSize: 11
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#f43f5e" },
              { offset: 1, color: "#be123c" }
            ]),
            borderRadius: [4, 4, 4, 4],
            shadowColor: "rgba(244, 63, 94, 0.25)",
            shadowBlur: 6
          },
          emphasis: {
            itemStyle: {
              color: "#fb7185",
              shadowColor: "rgba(244, 63, 94, 0.5)",
              shadowBlur: 12
            }
          },
          data: negativeData
        },
        // 4. Governed Milestone Pillars (Start & End)
        {
          name: "Governed Baseline / End State",
          type: "bar",
          stack: "Total",
          barMaxWidth: 44,
          label: {
            show: true,
            position: "top",
            offset: [0, -3],
            formatter: (p: any) => (p.value > 0 ? `${p.value}${unit}` : ""),
            color: "#38bdf8",
            fontWeight: "bold",
            fontSize: 12
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#38bdf8" },
              { offset: 1, color: "#0284c7" }
            ]),
            borderRadius: [6, 6, 0, 0],
            shadowColor: "rgba(56, 189, 248, 0.25)",
            shadowBlur: 8
          },
          emphasis: {
            itemStyle: {
              color: "#7dd3fc",
              shadowColor: "rgba(56, 189, 248, 0.5)",
              shadowBlur: 12
            }
          },
          data: totalData
        },
        // 5. Subtle Stepped Connecting Lines between stages
        {
          name: "Connector Guide",
          type: "line",
          step: "end",
          symbol: "circle",
          symbolSize: 4,
          showSymbol: false,
          lineStyle: {
            type: "dashed",
            color: "rgba(148, 163, 184, 0.4)",
            width: 1.2
          },
          tooltip: { show: false },
          data: connectorLineData
        }
      ]
    };
  }, [data, unit]);

  return <EChartWrapper option={option} height={height} />;
};
