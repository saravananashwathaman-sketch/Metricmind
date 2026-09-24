"use client";

import React, { useMemo } from "react";
import { EChartWrapper } from "./EChartWrapper";
import * as echarts from "echarts";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: string;
  width?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = "#38bdf8",
  height = "36px",
  width = "90px"
}) => {
  const option = useMemo<echarts.EChartsOption>(() => {
    return {
      grid: {
        left: 0,
        right: 0,
        top: 2,
        bottom: 2
      },
      xAxis: {
        type: "category",
        show: false,
        boundaryGap: false
      },
      yAxis: {
        type: "value",
        show: false
      },
      tooltip: {
        show: false
      },
      series: [
        {
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: color
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}40` },
              { offset: 1, color: `${color}00` }
            ])
          },
          data: data
        }
      ]
    };
  }, [data, color]);

  return <EChartWrapper option={option} height={height} width={width} className="shrink-0" />;
};
