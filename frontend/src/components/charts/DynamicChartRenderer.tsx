"use client";

import React from "react";
import { VisualizationPayload } from "@/types";
import { validateVisualization } from "@/lib/services/visualizationEngine";
import { ChartRegistry } from "./ChartRegistry";
import { BarChart3, AlertCircle } from "lucide-react";

interface DynamicChartRendererProps {
  visualization?: VisualizationPayload;
  height?: string | number;
}

export const DynamicChartRenderer: React.FC<DynamicChartRendererProps> = ({
  visualization,
  height = "320px"
}) => {
  if (!visualization) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-500 text-xs">
        <AlertCircle className="w-4 h-4 mr-2 text-slate-400" />
        Visualization unavailable for this result.
      </div>
    );
  }

  // Validate chart specification before rendering
  const validation = validateVisualization(visualization);
  if (!validation.valid) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
        <AlertCircle className="w-4 h-4 mr-2 text-amber-400" />
        <span>Visualization unavailable for this result.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visualization.title && (
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-xs font-bold text-slate-200">{visualization.title}</h4>
            {visualization.subtitle && (
              <p className="text-[10px] text-slate-400">{visualization.subtitle}</p>
            )}
          </div>
          {visualization.unit && (
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              Unit: {visualization.unit}
            </span>
          )}
        </div>
      )}

      <ChartRegistry visualization={visualization} height={height} />
    </div>
  );
};
