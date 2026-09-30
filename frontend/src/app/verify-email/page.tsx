"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Loader2,
  Lock
} from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { useAuth } from "@/lib/authContext";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const { user, loginDemo } = useAuth();
  const displayEmail = emailParam || user?.email || "your corporate email";

  const [isSimulating, setIsSimulating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleSimulateVerification = async () => {
    setIsSimulating(true);
    setTimeout(async () => {
      setIsVerified(true);
      setIsSimulating(false);
      // If user isn't logged in, log into demo mode
      if (!user) {
        try {
          await loginDemo("Executive");
        } catch {}
      }
    }, 1200);
  };

  const handleResend = () => {
    setResendSent(true);
    setTimeout(() => setResendSent(false), 5000);
  };

  return (
    <div className="flex flex-col justify-between min-h-full p-6 sm:p-10 lg:p-14">
      {/* Top Mobile Brand Bar */}
      <div className="flex lg:hidden items-center justify-between pb-6 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase text-slate-100">
              METRICMIND
            </span>
            <span className="block text-[10px] text-slate-400">Agentic Semantic BI</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-3xl bg-slate-900/85 border border-slate-800/90 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl overflow-hidden text-center space-y-6"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400 shadow-xl shadow-sky-500/10">
            {isVerified ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            ) : (
              <Mail className="w-9 h-9" />
            )}
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              {isVerified ? "Email Verified" : "Verify your email address"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              {isVerified ? (
                "Your corporate email has been verified. You now have full access to governed metrics."
              ) : (
                <>
                  We dispatched a verification link to{" "}
                  <span className="font-mono text-sky-300 font-semibold">{displayEmail}</span>.
                </>
              )}
            </p>
          </div>

          {/* Verification Actions */}
          {isVerified ? (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Simulated Verification for Demo Mode (Requirement 14 & 30) */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Simulated Verification Flow
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold uppercase">
                    DEMO MODE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In Demo Mode, you can test and confirm the email verification flow without connecting an external SMTP/SES service.
                </p>
                <button
                  type="button"
                  onClick={handleSimulateVerification}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Simulate Email Verification</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resend Link */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Didn&apos;t receive an email?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendSent}
                  className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {resendSent ? "Email resent!" : "Resend email"}
                </button>
              </div>

              {/* Return to login */}
              <div className="pt-2 border-t border-slate-800">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>&copy; 2026 MetricMind Enterprise. All rights reserved.</div>
        <div>Governed Analytical Intelligence</div>
      </footer>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:grid lg:grid-cols-12 selection:bg-sky-500/30 selection:text-sky-200">
      <div className="lg:col-span-6 xl:col-span-5 hidden lg:block">
        <BrandPanel />
      </div>
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center min-h-screen bg-slate-950/90 relative">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
