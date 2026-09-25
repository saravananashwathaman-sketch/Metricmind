"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  Bot,
  User,
  History,
  AlertCircle
} from "lucide-react";
import { MetricMindChatResponse, AgentStep, Role } from "@/types";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ReasoningProgress } from "./ReasoningProgress";
import { ExecutiveResponseCard } from "./ExecutiveResponseCard";
import { api } from "@/lib/api";
import { DEFAULT_EUROPE_MARGIN_RESPONSE } from "@/lib/mockData";

interface ChatInterfaceProps {
  userRole: Role;
  region: string;
  quarter: string;
  initialQuestion?: string;
  onSaveInsight: (res: MetricMindChatResponse) => void;
  onViewLineage: (metricId: string) => void;
  onExplainNumber?: (metricId: string, period?: string, region?: string, value?: string) => void;
  savedInsightIds: string[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userRole,
  region,
  quarter,
  initialQuestion,
  onSaveInsight,
  onViewLineage,
  onExplainNumber,
  savedInsightIds
}) => {
  const [questionInput, setQuestionInput] = useState(initialQuestion || "");
  const [isLoading, setIsLoading] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState<AgentStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState<MetricMindChatResponse | null>(
    DEFAULT_EUROPE_MARGIN_RESPONSE
  );
  const [chatHistory, setChatHistory] = useState<
    { id: string; question: string; response: MetricMindChatResponse }[]
  >([
    {
      id: "initial_demo",
      question: "Why did our European margins drop last quarter?",
      response: DEFAULT_EUROPE_MARGIN_RESPONSE
    }
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuestion && initialQuestion !== "Why did our European margins drop last quarter?") {
      handleSubmitQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  const handleSubmitQuestion = async (queryToAsk?: string) => {
    const q = (queryToAsk || questionInput).trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setQuestionInput("");

    // Simulate real-time progressive reasoning step animations
    const templateSteps: AgentStep[] = [
      { step_number: 1, title: "Understand User Intent", status: "in_progress", detail: "Analyzing natural language query semantics...", timestamp_ms: 20 },
      { step_number: 2, title: "Identify Governed Metric", status: "pending", detail: "Resolving entity to approved Semantic Catalog definition...", timestamp_ms: 45 },
      { step_number: 3, title: "Identify Target Dimensions", status: "pending", detail: "Determining dimensional grain...", timestamp_ms: 70 },
      { step_number: 4, title: "Identify Filters", status: "pending", detail: `Applying governance filters (${region})...`, timestamp_ms: 95 },
      { step_number: 5, title: "Identify Time Period", status: "pending", detail: `Targeting period: ${quarter}...`, timestamp_ms: 120 },
      { step_number: 6, title: "Retrieve Semantic Definition", status: "pending", detail: "Retrieving strict formula and dbt lineage...", timestamp_ms: 150 },
      { step_number: 7, title: "Construct Semantic Query", status: "pending", detail: "Building zero-rogue-SQL semantic payload...", timestamp_ms: 180 },
      { step_number: 8, title: "Execute Semantic Retrieval", status: "pending", detail: "Fetching verified metric records...", timestamp_ms: 210 },
      { step_number: 9, title: "Perform Analytical Reasoning", status: "pending", detail: "Decomposing variance and root cause drivers...", timestamp_ms: 240 },
      { step_number: 10, title: "Synthesize Executive Explanation", status: "pending", detail: "Drafting executive narrative & driver breakdown...", timestamp_ms: 270 },
      { step_number: 11, title: "Select Visualizations", status: "pending", detail: "Generating interactive Driver Waterfall & Bar charts...", timestamp_ms: 290 },
      { step_number: 12, title: "Finalize Governed Response", status: "pending", detail: "Applying cryptographic governance signature...", timestamp_ms: 310 }
    ];

    setReasoningSteps(templateSteps);
    setActiveStepIndex(0);

    // Progressive step interval
    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < 11) return prev + 1;
        return prev;
      });
    }, 180);

    try {
      const resp = await api.askQuestion(q, userRole, "Rajesh Kapoor", region, quarter);
      clearInterval(stepInterval);
      setReasoningSteps(resp.reasoning_steps);
      setActiveStepIndex(12);
      setCurrentResponse(resp);
      setChatHistory((prev) => [{ id: resp.conversation_id, question: q, response: resp }, ...prev]);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(
        "MetricMind couldn't complete the analytical reasoning. Please verify the requested governed metric or data source filters."
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-sky-400" />
            Ask MetricMind
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conversational BI interface where AI reasons over governed semantics instead of inventing SQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Governed Semantics Enforced</span>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Pill Carousel */}
      <SuggestedPrompts
        onSelectPrompt={(p) => handleSubmitQuestion(p)}
        disabled={isLoading}
      />

      {/* Natural Language Input Bar */}
      <div className="relative">
        <div className="flex items-center p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl focus-within:border-sky-500/80 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all backdrop-blur-xl">
          <div className="pl-3 pr-2 text-sky-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitQuestion();
              }
            }}
            placeholder="Ask anything (e.g. Why did our European margins drop last quarter?)"
            disabled={isLoading}
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none px-2 py-1.5"
          />
          <button
            onClick={() => handleSubmitQuestion()}
            disabled={!questionInput.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Reason</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Reasoning Progress UI */}
      {isLoading && (
        <ReasoningProgress
          steps={reasoningSteps}
          currentStepIndex={activeStepIndex}
          isComplete={false}
        />
      )}

      {/* Error notification if any */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Latest / Active Analytical Response */}
      {currentResponse && !isLoading && (
        <div className="space-y-6">
          <ExecutiveResponseCard
            response={currentResponse}
            onSaveInsight={onSaveInsight}
            onAskFollowup={(f) => handleSubmitQuestion(f)}
            onViewLineage={onViewLineage}
            onExplainNumber={onExplainNumber}
            isSaved={savedInsightIds.includes(currentResponse.conversation_id)}
          />

        </div>
      )}

      {/* Conversation Thread History */}
      {chatHistory.length > 1 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span>Prior Analytical Threads</span>
            </div>
            <span className="text-slate-500">{chatHistory.length - 1} Previous</span>
          </div>

          <div className="space-y-4">
            {chatHistory.slice(1).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-slate-200">
                    &quot;{item.question}&quot;
                  </div>
                  <button
                    onClick={() => {
                      setCurrentResponse(item.response);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    View Analysis →
                  </button>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.response.executive_summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
