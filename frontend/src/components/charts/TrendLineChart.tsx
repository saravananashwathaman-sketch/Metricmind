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
  title,
}) => {
  const option = useMemo<echarts.EChartsOption>(() => {
    // Governed Enterprise BI Chart Palette
    const palette = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6", "#F43F5E"];

    return {
      title: title
        ? {
            text: title,
            textStyle: { color: "#F8FAFC", fontSize: 13, fontWeight: "bold" as const },
            left: "2%",
            top: "2%",
          }
        : undefined,
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0F172A",
        borderColor: "#334155",
        borderWidth: 1,
        textStyle: { color: "#F8FAFC", fontSize: 12 },
        padding: [8, 12],
      },
      legend: {
        data: series.map((s) => s.name),
        textStyle: { color: "#94A3B8", fontSize: 11 },
        top: title ? "6%" : "2%",
        right: "3%",
        icon: "roundRect",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "8%",
        top: title ? "20%" : "16%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: periods,
        axisLine: { lineStyle: { color: "#334155" } },
        axisLabel: { color: "#94A3B8", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#334155", type: "dashed" } },
        axisLabel: {
          color: "#94A3B8",
          fontSize: 11,
          formatter: `{value}${unit}`,
        },
      },
      series: series.map((s, idx) => {
        const clr = s.color || palette[idx % palette.length];
        return {
          name: s.name,
          type: "line",
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 2.5, color: clr },
          itemStyle: { color: clr },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${clr}22` },
              { offset: 1, color: `${clr}00` },
            ]),
          },
          data: s.data,
        };
      }),
    };
  }, [periods, series, unit, title]);

  return <EChartWrapper option={option} height={height} />;
};
