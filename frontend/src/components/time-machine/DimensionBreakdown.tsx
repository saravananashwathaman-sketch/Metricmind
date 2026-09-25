"use client";

import React, { useState } from "react";
import { DimensionBreakdownItem } from "@/types/timeMachine";
import { BarChart3, ChevronRight, Layers, ArrowUpRight, TrendingDown } from "lucide-react";

interface DimensionBreakdownProps {
  dimensionName?: string;
  items: DimensionBreakdownItem[];
}

export const DimensionBreakdown: React.FC<DimensionBreakdownProps> = ({
  dimensionName = "Country",
  items
}) => {
  const [activeDrillLevel, setActiveDrillLevel] = useState<"Country" | "Product" | "Customer Segment">("Country");
  const [selectedCountry, setSelectedCountry] = useState<string>("Germany");

  // Mock product breakdown for selected country
  const productData: Record<string, { name: string; margin: string; share: number }[]> = {
    Germany: [
      { name: "Enterprise Cloud Infrastructure", margin: "34.2%", share: 45 },
      { name: "MetricMind Semantic Pro", margin: "31.8%", share: 30 },
      { name: "Edge Security Gateway", margin: "22.4%", share: 25 }
    ],
    France: [
      { name: "Enterprise Cloud Infrastructure", margin: "31.0%", share: 50 },
      { name: "MetricMind Semantic Pro", margin: "29.2%", share: 30 },
      { name: "Edge Security Gateway", margin: "21.0%", share: 20 }
    ],
    Spain: [
      { name: "Enterprise Cloud Infrastructure", margin: "28.0%", share: 40 },
      { name: "MetricMind Semantic Pro", margin: "24.5%", share: 35 },
      { name: "Edge Security Gateway", margin: "18.2%", share: 25 }
    ],
    Italy: [
      { name: "Enterprise Cloud Infrastructure", margin: "30.5%", share: 45 },
      { name: "MetricMind Semantic Pro", margin: "28.8%", share: 35 },
      { name: "Edge Security Gateway", margin: "24.1%", share: 20 }
    ]
  };

  const segmentData = [
    { name: "Strategic Enterprise Tier", margin: "30.8%", share: 58 },
    { name: "Mid-Market Growth Accounts", margin: "24.2%", share: 32 },
    { name: "Public Sector EMEA", margin: "21.0%", share: 10 }
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            DIMENSIONAL COMPOSITION (Europe 27.2%)
          </h3>
        </div>

        {/* Drill-down Hierarchy Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
          {(["Country", "Product", "Customer Segment"] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setActiveDrillLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeDrillLevel === lvl
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Drill Level 1: Country Breakdown */}
      {activeDrillLevel === "Country" && (
        <div className="space-y-3">
          <div className="text-xs text-slate-300 flex items-center justify-between">
            <span>European Theater Contribution by Jurisdiction:</span>
            <span className="text-[11px] text-slate-400 font-mono">Weighted Margin: 27.20%</span>
          </div>

          <div className="space-y-2.5">
            {(items || []).map((item) => (
              <div
                key={item.name}

                onClick={() => {
                  setSelectedCountry(item.name);
                  setActiveDrillLevel("Product");
                }}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/40 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                      {item.name}
                    </span>
                    {item.change_pp !== undefined && (
                      <span className="text-[10px] text-rose-400 flex items-center gap-0.5 font-mono">
                        <TrendingDown className="w-3 h-3" />
                        {item.change_pp} pp
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-100 text-sm">{item.formatted_value}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-sky-400 transition-all" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                    style={{ width: `${item.value * 2.5}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Volume share: ~{item.percentage_of_total}% of European sales</span>
                  <span className="text-sky-400 group-hover:underline">Explore Products →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drill Level 2: Product Breakdown for Selected Country */}
      {activeDrillLevel === "Product" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Country:</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-xs text-sky-300 font-bold focus:outline-none"
              >
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Spain">Spain</option>
                <option value="Italy">Italy</option>
              </select>
            </div>
            <button
              onClick={() => setActiveDrillLevel("Country")}
              className="text-[11px] text-sky-400 hover:underline"
            >
              ← Back to Countries
            </button>
          </div>

          <div className="space-y-2">
            {(productData[selectedCountry] || productData.Germany).map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200 block">{p.name}</span>
                  <span className="text-[10px] text-slate-400">Share of local revenue: {p.share}%</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-sky-300 font-mono block">{p.margin}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-mono">Gross Margin</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drill Level 3: Customer Segment */}
      {activeDrillLevel === "Customer Segment" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Customer Segmentation Breakdown (Europe):</span>
            <button
              onClick={() => setActiveDrillLevel("Country")}
              className="text-[11px] text-sky-400 hover:underline"
            >
              ← Back to Countries
            </button>
          </div>

          <div className="space-y-2">
            {segmentData.map((s) => (
              <div
                key={s.name}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200 block">{s.name}</span>
                  <span className="text-[10px] text-slate-400">Revenue Contribution: {s.share}%</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-300 font-mono block">{s.margin}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-mono">Governed Margin</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
