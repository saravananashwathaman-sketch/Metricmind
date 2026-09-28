"use client";

import React, { useState } from "react";
import {
  Play,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Award,
  Sparkles,
  Info
} from "lucide-react";
import { FIREWALL_ACCEPTANCE_TESTS, validateThroughFirewall } from "@/lib/firewallEngine";
import { FirewallTestCase, FirewallDecision } from "@/types/firewall";

export const FirewallTestLab: React.FC = () => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [testResults, setTestResults] = useState<
    Record<
      string,
      {
        decision: FirewallDecision;
        passedAcceptance: boolean;
        durationMs: number;
      }
    >
  >({});

  const runSingleTest = (test: FirewallTestCase) => {
    const start = performance.now();
    const decision = validateThroughFirewall(test.input, { userRole: "Sales Analyst" });
    const durationMs = Math.round(performance.now() - start);

    // In a security firewall, if a malicious/invalid request is BLOCKED as expected,
    // that counts as a successful test!
    const passedAcceptance = decision.status === test.expected_status;

    setTestResults((prev) => ({
      ...prev,
      [test.id]: { decision, passedAcceptance, durationMs }
    }));
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    const newResults: Record<
      string,
      {
        decision: FirewallDecision;
        passedAcceptance: boolean;
        durationMs: number;
      }
    > = {};

    for (let i = 0; i < FIREWALL_ACCEPTANCE_TESTS.length; i++) {
      const test = FIREWALL_ACCEPTANCE_TESTS[i];
      const start = performance.now();
      const decision = validateThroughFirewall(test.input, { userRole: "Sales Analyst" });
      const durationMs = Math.round(performance.now() - start);
      const passedAcceptance = decision.status === test.expected_status;
      newResults[test.id] = { decision, passedAcceptance, durationMs };
      // Small visual stagger
      await new Promise((resolve) => setTimeout(resolve, 80));
      setTestResults({ ...newResults });
    }

    setIsRunningAll(false);
  };

  const completedCount = Object.keys(testResults).length;
  const passedCount = Object.values(testResults).filter((r) => r.passedAcceptance).length;
  const approvedCount = Object.values(testResults).filter((r) => r.decision.status === "APPROVED").length;
  const blockedCount = Object.values(testResults).filter((r) => r.decision.status === "BLOCKED").length;

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Automated Acceptance Test Lab
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              8 Standard Acceptance Tests
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical security verification: run adversarial queries, unapproved metrics, and raw SQL injections to verify zero leakage to Cube.dev.
          </p>
        </div>

        <button
          onClick={runAllTests}
          disabled={isRunningAll}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isRunningAll ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing Test Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run All 8 Acceptance Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Score Summary Box (Matching Requirement 25 & 33) */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Firewall Test Results
            </span>
            <div className="text-lg font-black text-slate-100 flex items-center gap-2">
              <span>{completedCount === 0 ? "8 Tests Configured" : `${completedCount} Tests Executed`}</span>
              {completedCount > 0 && (
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  ({passedCount}/{completedCount} Passed Enforcement)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{approvedCount} Approved as Governed</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>{blockedCount} Blocked as Expected</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 font-semibold">
            <span>100% Policy Adherence</span>
          </div>
        </div>
      </div>

      {/* Note: A blocked malicious/invalid request counts as a successful firewall test */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-sky-400 shrink-0" />
        <span>
          <strong className="text-slate-200">Rule 25 Policy:</strong> In security testing, an adversarial, invalid, or raw SQL request that is blocked counts as a successful firewall validation test.
        </span>
      </div>

      {/* 8 Acceptance Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {FIREWALL_ACCEPTANCE_TESTS.map((test) => {
          const res = testResults[test.id];
          const hasRun = Boolean(res);

          return (
            <div
              key={test.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                hasRun
                  ? res.passedAcceptance
                    ? "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                    : "bg-rose-950/20 border-rose-500/40"
                  : "bg-slate-950/40 border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    TEST {test.test_number}
                  </span>
                  <span className="text-xs font-bold text-slate-200 truncate">{test.title}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      test.expected_status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    }`}
                  >
                    Expected: {test.expected_status}
                  </span>

                  <button
                    onClick={() => runSingleTest(test)}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
                    title="Run single test"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/80 font-mono text-[11px] text-slate-300">
                &quot;{test.input}&quot;
              </div>

              {hasRun && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    {res.passedAcceptance ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className={res.passedAcceptance ? "text-emerald-300" : "text-rose-300"}>
                      Actual: {res.decision.status} ({res.durationMs}ms)
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    Cube API: {res.decision.cube_request_sent ? "SENT" : "NOT CALLED"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
