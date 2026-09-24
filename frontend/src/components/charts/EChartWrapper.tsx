"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface EChartWrapperProps {
  option: echarts.EChartsOption;
  height?: string | number;
  width?: string | number;
  className?: string;
  theme?: "dark" | "light";
}

export const EChartWrapper: React.FC<EChartWrapperProps> = ({
  option,
  height = "320px",
  width = "100%",
  className = "",
  theme = "dark"
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, theme === "dark" ? "dark" : undefined, {
        renderer: "canvas"
      });
    }

    const defaultThemeOptions: echarts.EChartsOption = {
      backgroundColor: "transparent",
      textStyle: {
        fontFamily: "var(--font-geist-sans), Inter, sans-serif"
      },
      ...option
    };

    chartInstance.current.setOption(defaultThemeOptions, true);

    // Initial resize trigger to guarantee rendering
    const timer = setTimeout(() => {
      chartInstance.current?.resize();
    }, 50);

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [option, theme]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ minHeight: height, height, width }}
      className={`relative w-full ${className}`}
    />
  );
};
