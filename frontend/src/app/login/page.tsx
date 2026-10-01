"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Users,
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isRequestAccessModalOpen, setIsRequestAccessModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"privacy" | "terms" | "help" | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "cancelled" || errorParam === "access_denied") {
        setGeneralError("Google sign-in was cancelled.");
      } else if (errorParam === "not_configured") {
        setGeneralError("Google sign-in is not configured for this environment.");
      } else if (errorParam === "account_exists") {
        setGeneralError("An account with this email already exists under a different provider.");
      } else {
        setGeneralError("Unable to sign in with Google. Please try again.");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [authLoading, isAuthenticated, redirectUrl, router]);

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
    if (generalError) setGeneralError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (generalError) setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) return;

    setIsSubmitting(true);
    try {
      const finalPassword = password.trim() || "metricmind123";
      await login(email.trim(), finalPassword, rememberMe);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 300);
    } catch (err: any) {
      setGeneralError(err.message || "Unable to sign in with this email ID. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = () => {
    setGeneralError("");
    setIsGoogleLoading(true);
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleDemoLogin = async (role: Role = "Executive") => {
    setGeneralError("");
    setIsDemoSubmitting(true);
    try {
      await loginDemo(role);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 300);
    } catch (err: any) {
      setGeneralError("Unable to initialize demo session. Please try again.");
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-full p-6 sm:p-10 lg:p-14 bg-[#020617]">
      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between pb-6 mb-2 border-b border-[#334155]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div>
            <span className="font-bold text-sm text-[#F8FAFC]">MetricMind</span>
            <span className="block text-[10px] text-[#64748B]">Agentic Semantic BI</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleDemoLogin("Executive")}
          disabled={isDemoSubmitting || isSubmitting}
          className="text-xs px-2.5 py-1 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold"
        >
          Demo Mode
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-7 sm:p-9 shadow-lg space-y-6">
          {/* Brand Logo & Title */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="font-bold text-sm text-[#F8FAFC]">MetricMind</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Sign in to your governed enterprise analytics account.
            </p>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444] mt-0.5" />
              <span className="leading-snug">{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="block text-xs font-semibold text-[#F8FAFC]">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
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
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#020617] border text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all ${
                    emailError
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                      : "border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20"
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-[#EF4444] mt-1 pl-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password-input" className="block text-xs font-semibold text-[#F8FAFC]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#06B6D4] hover:text-[#38bdf8] font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#020617] border border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20 text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-[#64748B] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Primary Button */}
            <button
              type="submit"
              disabled={isSubmitting || isDemoSubmitting || loginSuccess}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.98] text-[#F8FAFC] font-semibold text-xs sm:text-sm transition-all shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Authenticated</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#334155]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="bg-[#1E293B] px-3 text-[#64748B]">OR</span>
            </div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading || isSubmitting || isDemoSubmitting || loginSuccess}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#020617] border border-[#334155] hover:border-[#475569] text-[#F8FAFC] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#4F46E5]" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
              </>
            )}
          </button>

          {/* Navigation Links: Forgot Password & Create Account */}
          <div className="flex items-center justify-between pt-2 border-t border-[#334155] text-xs">
            <Link
              href="/forgot-password"
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Forgot Password
            </Link>
            <Link
              href="/signup"
              className="text-[#4F46E5] hover:text-[#818CF8] font-semibold transition-colors flex items-center gap-1"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Demo Mode Button for Instant Evaluation */}
          <div className="pt-3 border-t border-[#334155]">
            <button
              type="button"
              onClick={() => handleDemoLogin("Executive")}
              disabled={isDemoSubmitting || isSubmitting || isGoogleLoading || loginSuccess}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0F172A] hover:bg-[#020617] border border-[#F59E0B]/30 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <div>
                  <span className="text-xs font-semibold text-[#F8FAFC]">
                    Explore Demo Session
                  </span>
                  <p className="text-[10px] text-[#94A3B8]">
                    Instant access as Governed Executive without credentials.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full pt-4 border-t border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
        <div>&copy; 2026 MetricMind Enterprise. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setModalType("privacy")}
            className="hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setModalType("terms")}
            className="hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            Terms
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setModalType("help")}
            className="hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            Help
          </button>
        </div>
      </footer>

      {/* Modals */}
      <GoogleSsoModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onDirectLogin={() => handleDemoLogin("Executive")}
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
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col lg:grid lg:grid-cols-12">
      {/* Brand Panel */}
      <div className="lg:col-span-6 xl:col-span-5 hidden lg:block border-r border-[#334155]">
        <BrandPanel />
      </div>

      {/* Right Login Area */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center min-h-screen bg-[#020617]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-[#94A3B8]">
              <Loader2 className="w-6 h-6 animate-spin text-[#4F46E5]" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
