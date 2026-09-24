"use client";

import React, { useMemo } from "react";
import { EChartWrapper } from "./EChartWrapper";
import * as echarts from "echarts";

interface TrendLineChartProps {
  periods: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  height?: string;
  unit?: string;
  title?: string;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  periods,
  series,
  height = "320px",
  unit = "%",
  title
}) => {
  const option = useMemo<echarts.EChartsOption>(() => {
    const palette = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e"];

    return {
      title: title
        ? {
            text: title,
            textStyle: { color: "#cbd5e1", fontSize: 13, fontWeight: "bold" as const },
            left: "2%",
            top: "2%"
          }
        : undefined,
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.15)",
        textStyle: { color: "#f8fafc", fontSize: 12 }
      },
      legend: {
        data: series.map((s) => s.name),
        textStyle: { color: "#94a3b8", fontSize: 11 },
        top: title ? "6%" : "2%",
        right: "3%"
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "8%",
        top: title ? "20%" : "16%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: periods,
        axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 }
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.06)", type: "dashed" } },
        axisLabel: {
          color: "#64748b",
          formatter: `{value}${unit}`
        }
      },
      series: series.map((s, idx) => {
        const clr = s.color || palette[idx % palette.length];
        return {
          name: s.name,
          type: "line",
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 3, color: clr },
          itemStyle: { color: clr },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${clr}44` },
              { offset: 1, color: `${clr}00` }
            ])
          },
          data: s.data
        };
      })
    };
  }, [periods, series, unit, title]);

  return <EChartWrapper option={option} height={height} />;
};
