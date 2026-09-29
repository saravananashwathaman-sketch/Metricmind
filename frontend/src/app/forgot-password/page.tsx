"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (val: string): boolean => {
    if (!val.trim()) {
      setEmailError("Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      await api.forgotPassword(email.trim());
      setIsSuccess(true);
    } catch (err: any) {
      // Enterprise security: Do not reveal specific account existence
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:grid lg:grid-cols-12 selection:bg-sky-500/30 selection:text-sky-200">
      {/* Left side brand panel */}
      <div className="lg:col-span-6 xl:col-span-5 hidden lg:block">
        <BrandPanel />
      </div>

      {/* Right side forgot password card */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-14 bg-slate-950/90">
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-3xl bg-slate-900/80 border border-slate-800/90 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

            {/* Back link */}
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Return to Sign In</span>
              </Link>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-100">Reset Link Dispatched</h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                    If the account exists, recovery instructions have been sent to{" "}
                    <span className="font-mono text-sky-300 font-semibold">{email}</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-xs text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Next Steps</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                    <li>Check your corporate inbox and spam filter</li>
                    <li>Security links expire automatically in 60 minutes</li>
                    <li>Contact internal IT if SSO enforcement is enabled</li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-500/20 text-center"
                  >
                    Back to Sign In
                  </Link>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors pt-1"
                  >
                    Try another email address
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="space-y-1.5 mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                    Reset your password
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Enter your email address and we&apos;ll help you recover access.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="reset-email"
                      className="block text-xs font-semibold text-slate-300"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) validateEmail(e.target.value);
                        }}
                        onBlur={() => validateEmail(email)}
                        placeholder="you@company.com"
                        aria-invalid={!!emailError}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                          emailError
                            ? "border-rose-500/70 focus:border-rose-400"
                            : "border-slate-800 focus:border-sky-500"
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-[11px] text-rose-400 mt-1 pl-1">{emailError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
                  <span>Remembered your password? </span>
                  <Link
                    href="/login"
                    className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
          <div>&copy; 2026 MetricMind Enterprise.</div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Sign In
            </Link>
            <span>•</span>
            <span className="text-slate-500">Zero-Trust Security</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
