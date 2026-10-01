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
  unit = "%",
}) => {
  const option = useMemo<echarts.EChartsOption>(() => {
    // Enterprise palette
    const defaultColors = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6", "#F43F5E"];

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "#0F172A",
        borderColor: "#334155",
        borderWidth: 1,
        borderRadius: 8,
        padding: [10, 14],
        textStyle: { color: "#F8FAFC", fontSize: 12 },
      },
      legend: {
        data: series.map((s) => s.name),
        textStyle: { color: "#94A3B8", fontSize: 11 },
        top: "2%",
        right: "3%",
        icon: "roundRect",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "6%",
        top: "14%",
        containLabel: true,
      },
      xAxis: horizontal
        ? {
            type: "value",
            axisLine: { show: false },
            splitLine: { lineStyle: { color: "#334155", type: "dashed" } },
            axisLabel: {
              color: "#94A3B8",
              formatter: `{value}${unit}`,
            },
          }
        : {
            type: "category",
            data: categories,
            axisLine: { lineStyle: { color: "#334155" } },
            axisLabel: { color: "#94A3B8", fontSize: 11 },
          },
      yAxis: horizontal
        ? {
            type: "category",
            data: categories,
            axisLine: { lineStyle: { color: "#334155" } },
            axisLabel: { color: "#94A3B8", fontSize: 11 },
          }
        : {
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
        const clr = s.color || defaultColors[idx % defaultColors.length];
        return {
          name: s.name,
          type: "bar",
          barMaxWidth: 28,
          itemStyle: {
            color: clr,
            borderRadius: [4, 4, 0, 0],
          },
          data: s.data,
        };
      }),
    };
  }, [categories, series, horizontal, unit]);

  return <EChartWrapper option={option} height={height} />;
};
