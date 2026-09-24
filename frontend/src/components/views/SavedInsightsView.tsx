"use client";

import React, { useState, useEffect } from "react";
import {
  BookmarkCheck,
  Trash2,
  Share2,
  Sparkles,
  Layers,
  Calendar,
  User,
  ArrowRight
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
  onAskQuestion
}) => {
  const [insights, setInsights] = useState<SavedInsight[]>(INITIAL_SAVED_INSIGHTS);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    const list = await api.getSavedInsights();
    setInsights(list);
  };

  const handleDelete = async (id: string) => {
    await api.deleteInsight(id);
    setDeletedId(id);
    setInsights((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <BookmarkCheck className="w-6 h-6 text-sky-400" />
            Saved Executive Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curated repository of business analytical answers, governed driver decompositions, and charts.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          {insights.length} Saved Insights
        </div>
      </div>

      {/* Grid of Saved Insight Cards */}
      {insights.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Saved Insights Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Ask any question in Ask MetricMind and click &quot;Save Insight&quot; to pin governing analyses here.
          </p>
          <button
            onClick={() => onAskQuestion("Why did our European margins drop last quarter?")}
            className="px-4 py-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold hover:bg-sky-500/30 transition-colors"
          >
            Ask Demo Question →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-5 group hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                      Metric: {item.metric_id}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">{item.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Saved Insight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {item.executive_summary}
                </div>

                {/* Embedded Mini Chart */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  {item.chart_type === "waterfall" ? (
                    <WaterfallChart data={item.chart_data} height="200px" unit="%" />
                  ) : (
                    <ComparisonBarChart
                      categories={item.chart_data.map((d: any) => d.name)}
                      series={[
                        { name: "Current", data: item.chart_data.map((d: any) => d.value), color: "#38bdf8" }
                      ]}
                      height="200px"
                      unit=""
                    />
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-[11px] font-mono text-sky-300 truncate">
                  Formula: {item.semantic_definition}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {item.created_by}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.created_at}
                  </span>
                </div>

                <button
                  onClick={() => onAskQuestion(item.question)}
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold"
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
