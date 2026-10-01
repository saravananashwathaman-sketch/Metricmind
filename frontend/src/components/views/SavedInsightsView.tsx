"use client";

import React, { useState, useEffect } from "react";
import {
  BookmarkCheck,
  Trash2,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
import { SavedInsight } from "@/types";
import { api } from "@/lib/api";
import { INITIAL_SAVED_INSIGHTS } from "@/lib/mockData";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";

interface SavedInsightsViewProps {
  onAskQuestion: (q: string) => void;
}

export const SavedInsightsView: React.FC<SavedInsightsViewProps> = ({
  onAskQuestion,
}) => {
  const [insights, setInsights] = useState<SavedInsight[]>(INITIAL_SAVED_INSIGHTS);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    const list = await api.getSavedInsights();
    setInsights(list);
  };

  const handleDelete = async (id: string) => {
    await api.deleteInsight(id);
    setInsights((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#4F46E5]/15 text-[#818CF8] border border-[#4F46E5]/30">
              Saved Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <BookmarkCheck className="w-6 h-6 text-[#4F46E5]" />
            Dynamic Insights
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Curated repository of business analytical answers, governed driver decompositions, and charts.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#1E293B] border border-[#334155] text-[#94A3B8]">
          {insights.length} Saved Insights
        </div>
      </div>

      {/* Grid of Saved Insight Cards */}
      {insights.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1E293B] border border-[#334155] space-y-3">
          <BookmarkCheck className="w-10 h-10 text-[#64748B] mx-auto" />
          <h3 className="text-base font-bold text-[#F8FAFC]">No Saved Insights Yet</h3>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            Ask any question in Ask MetricMind and click &quot;Save Insight&quot; to pin governing analyses here.
          </p>
          <button
            type="button"
            onClick={() => onAskQuestion("Why did our European margins drop last quarter?")}
            className="px-4 py-2 rounded-xl bg-[#4F46E5] text-[#F8FAFC] text-xs font-semibold hover:bg-[#4338CA] transition-colors cursor-pointer"
          >
            Ask Demo Question →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-sm flex flex-col justify-between space-y-5 hover:border-[#475569] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider">
                      Metric: {item.metric_id}
                    </span>
                    <h3 className="text-base font-semibold text-[#F8FAFC] mt-0.5">{item.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#0F172A] transition-colors cursor-pointer"
                    title="Delete Saved Insight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8] leading-relaxed">
                  {item.executive_summary}
                </div>

                {/* Embedded Mini Chart */}
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155]">
                  {item.chart_type === "waterfall" ? (
                    <WaterfallChart data={item.chart_data} height="200px" unit="%" />
                  ) : (
                    <ComparisonBarChart
                      categories={item.chart_data.map((d: any) => d.name)}
                      series={[
                        { name: "Current", data: item.chart_data.map((d: any) => d.value), color: "#4F46E5" },
                      ]}
                      height="200px"
                      unit=""
                    />
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[11px] font-mono text-[#06B6D4] truncate">
                  Formula: {item.semantic_definition}
                </div>
              </div>

              <div className="pt-3 border-t border-[#334155] flex items-center justify-between text-[11px] text-[#64748B]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {item.created_by}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {item.created_at}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAskQuestion(item.question)}
                  className="flex items-center gap-1 text-[#4F46E5] hover:text-[#818CF8] font-semibold cursor-pointer"
                >
                  <span>Re-open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
