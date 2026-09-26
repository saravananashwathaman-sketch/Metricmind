"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  Search,
  Network,
  Bell,
  Cpu,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  AlertCircle
} from "lucide-react";
import { ImpactAssessment } from "@/types/impact";

interface ImpactSummaryProps {
  assessment: ImpactAssessment;
  activeFilter?: string;
  onSelectCategory?: (category: string) => void;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({
  assessment,
  activeFilter = "all",
  onSelectCategory
}) => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const getImpactBadge = (level: string) => {
    switch (level) {
      case "HIGH":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          bar: "bg-rose-500",
          scoreBg: "text-rose-400"
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          bar: "bg-amber-500",
          scoreBg: "text-amber-400"
        };
      default:
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          bar: "bg-emerald-500",
          scoreBg: "text-emerald-400"
        };
    }
  };

  const badge = getImpactBadge(assessment.level);

  const categories = [
    {
      id: "dashboard",
      label: "Dashboards",
      count: assessment.dashboards_count,
      icon: <LayoutDashboard className="w-4 h-4 text-sky-400" />,
      desc: "Live executive & team dashboards"
    },
    {
      id: "report",
      label: "Reports",
      count: assessment.reports_count,
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      desc: "Board packs & operational decks"
    },
    {
      id: "saved_insight",
      label: "Saved Insights",
      count: assessment.saved_insights_count,
      icon: <BookmarkCheck className="w-4 h-4 text-emerald-400" />,
      desc: "Historical agentic findings"
    },
    {
      id: "query",
      label: "Saved Queries",
      count: assessment.queries_count,
      icon: <Search className="w-4 h-4 text-amber-400" />,
      desc: "Automated business queries"
    },
    {
      id: "dependent_metric",
      label: "Dependent Metrics",
      count: assessment.dependent_metrics_count,
      icon: <Network className="w-4 h-4 text-purple-400" />,
      desc: "Cascading derived measures"
    },
    {
      id: "alert",
      label: "Active Alerts",
      count: assessment.alerts_count,
      icon: <Bell className="w-4 h-4 text-rose-400" />,
      desc: "Automated Slack / Email threshold triggers"
    },
    {
      id: "api_consumer",
      label: "API Consumers",
      count: assessment.api_consumers_count,
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      desc: "Downstream external integrations (CPQ)"
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Top Header & Impact Level Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              Section 8 & 9 • Impact Footprint Assessment
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-100">
            Downstream Impact Categories & Governance Score
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time graph traversal reveals every asset that consumes this governed metric either directly or through secondary derived formulas.
          </p>
        </div>

        {/* Impact Level Score Card */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Governance Impact</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider ${badge.bg}`}>
                {assessment.level} IMPACT
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                Score: {assessment.score}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Category Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {categories.map((cat) => {
          const isSelected = activeFilter === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-sky-500/15 border-sky-500/60 ring-1 ring-sky-500/30 shadow-lg shadow-sky-500/10"
                  : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {cat.icon}
                </span>
                <span className="text-xl font-black text-slate-100 font-mono">
                  {cat.count}
                </span>
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold text-slate-200 truncate">{cat.label}</h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{cat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Section 9: "How is impact calculated?" */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <button
          onClick={() => setIsMethodologyOpen(!isMethodologyOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">How is impact calculated?</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">— Methodology & Mathematical Weighting</span>
          </div>
          {isMethodologyOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isMethodologyOpen && (
          <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs text-slate-400">
            <p className="text-slate-300 leading-relaxed">
              {assessment.methodology}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {assessment.calculation_explanation.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <span className="text-[11px] text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Analytically Transparent:</strong> This score reflects dependency volume and cascading risk rather than subjective evaluation.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
