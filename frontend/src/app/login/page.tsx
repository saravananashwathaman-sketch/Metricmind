"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  Users
} from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { GoogleSsoModal } from "@/components/auth/GoogleSsoModal";
import { RequestAccessModal } from "@/components/auth/RequestAccessModal";
import { TermsPrivacyHelpModal } from "@/components/auth/TermsPrivacyHelpModal";
import { useAuth } from "@/lib/authContext";
import { Role } from "@/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login, loginDemo, isAuthenticated, isLoading: authLoading } = useAuth();

  // Form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Loading & status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Modals state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isRequestAccessModalOpen, setIsRequestAccessModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"privacy" | "terms" | "help" | null>(null);

  // If already authenticated and not loading, redirect to target
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [authLoading, isAuthenticated, redirectUrl, router]);

  // Validate email format
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

  // Validate password
  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError("Password is required.");
      return false;
    }
    if (val.length < 3) {
      setPasswordError("Password must be at least 3 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
    if (generalError) setGeneralError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) validatePassword(e.target.value);
    if (generalError) setGeneralError("");
  };

  // Standard Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password, rememberMe);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch (err: any) {
      setGeneralError(err.message || "Unable to sign in. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Demo Mode Login
  const handleDemoLogin = async (role: Role = "Executive") => {
    setGeneralError("");
    setIsDemoSubmitting(true);
    try {
      await loginDemo(role);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 400);
    } catch (err: any) {
      setGeneralError("Unable to initialize demo session. Please try again.");
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  // Quick Account Autofill Helper for reviewers
  const handleAutofill = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
  };

  return (
    <div className="flex flex-col justify-between min-h-full p-6 sm:p-10 lg:p-14">
      {/* Top Mobile Brand Bar (Only on small screens) */}
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
        <button
          onClick={() => handleDemoLogin("Executive")}
          disabled={isDemoSubmitting || isSubmitting}
          className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium"
        >
          Demo Mode
        </button>
      </div>

      {/* Centered Glassmorphic Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-3xl bg-slate-900/80 border border-slate-800/90 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle top card glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

          {/* Heading & Subtitle */}
          <div className="space-y-1.5 text-left mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Sign in to continue to MetricMind
            </p>
          </div>

          {/* General Error Banner */}
          <AnimatePresence>
            {generalError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-snug">{generalError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email-input"
                className="block text-xs font-semibold text-slate-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="you@company.com"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                    emailError
                      ? "border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30"
                      : "border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  }`}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-[11px] text-rose-400 mt-1 pl-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  placeholder="Enter your password"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                    passwordError
                      ? "border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30"
                      : "border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-[11px] text-rose-400 mt-1 pl-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950/80 text-sky-500 focus:ring-sky-500/40 focus:ring-offset-slate-900 cursor-pointer accent-sky-500"
              />
              <label
                htmlFor="remember-me"
                className="text-xs text-slate-400 cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting || isDemoSubmitting || loginSuccess}
              className="w-full relative flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="bg-slate-900 px-3 text-slate-500">OR</span>
            </div>
          </div>

          {/* Continue with Google (Official Branding) */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all shadow-sm group cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue in Demo Mode Section */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("Executive")}
              disabled={isDemoSubmitting || isSubmitting || loginSuccess}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-200 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-200">
                      Continue in Demo Mode
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase font-semibold">
                      DEMO MODE
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-300/80 mt-0.5">
                    Explore MetricMind without connecting a production account.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400/70 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* Quick Demo Role Selector Pills */}
            <div className="flex items-center justify-between gap-1 pt-1 text-[10px] text-slate-400">
              <span className="text-slate-500 flex items-center gap-1 shrink-0">
                <Users className="w-3 h-3" />
                Roles:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("Executive")}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 transition-colors"
                  title="Rajesh Kapoor (Executive)"
                >
                  Executive
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("Finance Analyst")}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 transition-colors"
                  title="Priya Sharma (Finance Analyst)"
                >
                  Finance
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("Sales Analyst")}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-purple-500/20 hover:text-purple-300 text-slate-300 transition-colors"
                  title="Devon Clark (Sales Analyst)"
                >
                  Sales
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("Admin")}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 transition-colors"
                  title="Vikram Malhotra (Admin)"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Don't have an account? Create an account */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/70 text-center text-xs text-slate-400">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="text-sky-400 hover:text-sky-300 font-semibold hover:underline underline-offset-2 transition-all cursor-pointer inline-flex items-center gap-1 group"
            >
              <span>Create an account</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Security Message */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/50 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Your business data stays governed and protected.</span>
          </div>

          {/* Need Access / Sign Up link */}
          <div className="mt-3 text-center text-xs text-slate-400">
            <span>Need access? </span>
            <button
              type="button"
              onClick={() => setIsRequestAccessModalOpen(true)}
              className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Contact your administrator
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>&copy; 2026 MetricMind Enterprise. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setModalType("privacy")}
            className="hover:text-slate-300 transition-colors"
          >
            Privacy
          </button>
          <span>•</span>
          <button
            onClick={() => setModalType("terms")}
            className="hover:text-slate-300 transition-colors"
          >
            Terms
          </button>
          <span>•</span>
          <button
            onClick={() => setModalType("help")}
            className="hover:text-slate-300 transition-colors"
          >
            Help
          </button>
        </div>
      </footer>

      {/* Modals */}
      <GoogleSsoModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
      <RequestAccessModal
        isOpen={isRequestAccessModalOpen}
        onClose={() => setIsRequestAccessModalOpen(false)}
      />
      <TermsPrivacyHelpModal
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:grid lg:grid-cols-12 selection:bg-sky-500/30 selection:text-sky-200">
      {/* LEFT SIDE: Brand / Product Showcase (5 cols on large screens) */}
      <div className="lg:col-span-6 xl:col-span-5 hidden lg:block">
        <BrandPanel />
      </div>

      {/* RIGHT SIDE: Centered Login Card (7 cols on large screens) */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center min-h-screen bg-slate-950/90 relative">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
