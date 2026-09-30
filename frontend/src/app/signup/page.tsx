"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  Layers,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Check,
  X
} from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { GoogleSsoModal } from "@/components/auth/GoogleSsoModal";
import { TermsPrivacyHelpModal } from "@/components/auth/TermsPrivacyHelpModal";
import { useAuth } from "@/lib/authContext";
import { Role } from "@/types";

interface PasswordCriteria {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { signup, loginDemo, isAuthenticated, isLoading: authLoading } = useAuth();

  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Field visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [jobTitleError, setJobTitleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Loading & status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);

  // Modals state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"privacy" | "terms" | "help" | null>(null);

  // If already authenticated and not currently on signup flow, redirect to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && !signupSuccess) {
      router.push(redirectUrl);
    }
  }, [authLoading, isAuthenticated, redirectUrl, router, signupSuccess]);

  // Password criteria computation
  const passwordCriteria: PasswordCriteria = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[\W_]/.test(password)
  };

  const satisfiedCount = Object.values(passwordCriteria).filter(Boolean).length;

  let strengthLabel = "Weak";
  let strengthColor = "bg-rose-500";
  let strengthTextColor = "text-rose-400";
  let strengthPercent = 20;

  if (password.length > 0) {
    if (satisfiedCount <= 2 || password.length < 8) {
      strengthLabel = "Weak";
      strengthColor = "bg-rose-500";
      strengthTextColor = "text-rose-400";
      strengthPercent = 33;
    } else if (satisfiedCount === 3 || satisfiedCount === 4) {
      strengthLabel = "Medium";
      strengthColor = "bg-amber-500";
      strengthTextColor = "text-amber-400";
      strengthPercent = 66;
    } else if (satisfiedCount === 5) {
      strengthLabel = "Strong";
      strengthColor = "bg-emerald-500";
      strengthTextColor = "text-emerald-400";
      strengthPercent = 100;
    }
  }

  // Field validation functions
  const validateName = (val: string): boolean => {
    if (!val.trim()) {
      setNameError("Full name is required.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (val: string): boolean => {
    if (!val.trim()) {
      setEmailError("Work email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      setEmailError("Please enter a valid work email.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateOrganization = (val: string): boolean => {
    if (!val.trim()) {
      setOrganizationError("Organization or company is required.");
      return false;
    }
    setOrganizationError("");
    return true;
  };

  const validateJobTitle = (val: string): boolean => {
    if (!val.trim()) {
      setJobTitleError("Job title is required.");
      return false;
    }
    setJobTitleError("");
    return true;
  };

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError("Password is required.");
      return false;
    }
    if (val.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return false;
    }
    if (!/[A-Z]/.test(val) || !/[a-z]/.test(val) || !/\d/.test(val) || !/[\W_]/.test(val)) {
      setPasswordError("Please create a stronger password (uppercase, lowercase, number, symbol).");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (val: string, pwdVal: string = password): boolean => {
    if (!val) {
      setConfirmPasswordError("Please confirm your password.");
      return false;
    }
    if (val !== pwdVal) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validateTerms = (checked: boolean): boolean => {
    if (!checked) {
      setTermsError("Please accept the Terms of Service and Privacy Policy.");
      return false;
    }
    setTermsError("");
    return true;
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isOrgValid = validateOrganization(organization);
    const isTitleValid = validateJobTitle(jobTitle);
    const isPassValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword, password);
    const isTermsValid = validateTerms(agreeTerms);

    if (
      !isNameValid ||
      !isEmailValid ||
      !isOrgValid ||
      !isTitleValid ||
      !isPassValid ||
      !isConfirmValid ||
      !isTermsValid
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const authSession = await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        organization: organization.trim(),
        jobTitle: jobTitle.trim(),
        department: department.trim() || "Business Analytics",
        password
      });

      setCreatedUser(authSession.user);
      setSignupSuccess(true);
    } catch (err: any) {
      setGeneralError(err.message || "We couldn't create your account right now. Please try again.");
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
      router.push(redirectUrl);
    } catch (err: any) {
      setGeneralError("Unable to initialize demo session. Please try again.");
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  // ========================================================
  // SUCCESS SCREEN (Requirement 15)
  // ========================================================
  if (signupSuccess && createdUser) {
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

        {/* Success Card */}
        <div className="w-full max-w-lg mx-auto my-auto py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-3xl bg-slate-900/85 border border-slate-800/90 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl overflow-hidden text-center space-y-6"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                Welcome to MetricMind
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Your account has been created successfully.
              </p>
            </div>

            {/* Account Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400">Account Summary</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                    Full Name
                  </span>
                  <span className="font-semibold text-slate-200">{createdUser.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                    Work Email
                  </span>
                  <span className="font-mono text-slate-300 text-[11px] truncate block">
                    {createdUser.email}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                    Organization
                  </span>
                  <span className="font-semibold text-slate-200">
                    {createdUser.organization || organization}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                    Initial Role
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[11px] font-medium inline-block">
                    {createdUser.role || "Executive"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Governed semantic catalog access enabled for your tenant.</span>
              </div>
            </div>

            {/* Email Verification Architecture Notice */}
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/25 text-left text-xs text-sky-200 flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-sky-300">Email Verification Ready</span>
                <p className="text-[11px] text-sky-200/80 leading-relaxed">
                  Account created successfully. Check your email if domain verification is required by your enterprise administrator, or visit{" "}
                  <Link href="/verify-email" className="underline font-semibold hover:text-white">
                    /verify-email
                  </Link>.
                </p>
              </div>
            </div>

            {/* Continue to MetricMind Button */}
            <button
              type="button"
              onClick={() => router.push(redirectUrl)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Continue to MetricMind</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>&copy; 2026 MetricMind Enterprise. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setModalType("privacy")} className="hover:text-slate-300 transition-colors">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => setModalType("terms")} className="hover:text-slate-300 transition-colors">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => setModalType("help")} className="hover:text-slate-300 transition-colors">
              Help
            </button>
          </div>
        </footer>

        <TermsPrivacyHelpModal type={modalType} onClose={() => setModalType(null)} />
      </div>
    );
  }

  // ========================================================
  // MAIN SIGNUP FORM
  // ========================================================
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
        <Link
          href="/login"
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium hover:text-white transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Centered Glassmorphic Signup Card */}
      <div className="w-full max-w-lg mx-auto my-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-3xl bg-slate-900/85 border border-slate-800/90 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle top card glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

          {/* Heading & Subtitle */}
          <div className="space-y-1.5 text-left mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              Create your MetricMind account
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join your organization and start exploring governed business intelligence.
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* 1. Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullname-input" className="block text-xs font-semibold text-slate-300">
                Full Name <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="fullname-input"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) validateName(e.target.value);
                    if (generalError) setGeneralError("");
                  }}
                  onBlur={() => validateName(name)}
                  placeholder="Enter your full name"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "name-error" : undefined}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                    nameError
                      ? "border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30"
                      : "border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  }`}
                />
              </div>
              {nameError && (
                <p id="name-error" className="text-[11px] text-rose-400 mt-1 pl-1">
                  {nameError}
                </p>
              )}
            </div>

            {/* 2. Work Email */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="block text-xs font-semibold text-slate-300">
                Work Email <span className="text-sky-400">*</span>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                    if (generalError) setGeneralError("");
                  }}
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

            {/* 3. Organization & Job Title (2 columns on sm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Organization */}
              <div className="space-y-1.5">
                <label htmlFor="org-input" className="block text-xs font-semibold text-slate-300">
                  Organization <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    id="org-input"
                    name="organization"
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                      if (organizationError) validateOrganization(e.target.value);
                      if (generalError) setGeneralError("");
                    }}
                    onBlur={() => validateOrganization(organization)}
                    placeholder="Company or organization"
                    aria-invalid={!!organizationError}
                    aria-describedby={organizationError ? "org-error" : undefined}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                      organizationError
                        ? "border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                    }`}
                  />
                </div>
                {organizationError && (
                  <p id="org-error" className="text-[11px] text-rose-400 mt-1 pl-1">
                    {organizationError}
                  </p>
                )}
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label htmlFor="title-input" className="block text-xs font-semibold text-slate-300">
                  Job Title <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    id="title-input"
                    name="jobTitle"
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                      if (jobTitleError) validateJobTitle(e.target.value);
                      if (generalError) setGeneralError("");
                    }}
                    onBlur={() => validateJobTitle(jobTitle)}
                    placeholder="e.g. Business Analyst"
                    aria-invalid={!!jobTitleError}
                    aria-describedby={jobTitleError ? "title-error" : undefined}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                      jobTitleError
                        ? "border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                    }`}
                  />
                </div>
                {jobTitleError && (
                  <p id="title-error" className="text-[11px] text-rose-400 mt-1 pl-1">
                    {jobTitleError}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Department (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="dept-input" className="block text-xs font-semibold text-slate-300">
                  Department
                </label>
                <span className="text-[10px] text-slate-500">Optional</span>
              </div>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="dept-input"
                  name="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Finance or Strategic Planning"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 5. Password */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="block text-xs font-semibold text-slate-300">
                Password <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                    if (confirmPassword && confirmPasswordError) {
                      validateConfirmPassword(confirmPassword, e.target.value);
                    }
                    if (generalError) setGeneralError("");
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="Create a strong password"
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

              {/* Password Strength Indicator (Requirement 6) */}
              {password.length > 0 && (
                <div className="pt-1.5 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Password Strength</span>
                    <span className={`font-semibold ${strengthTextColor}`}>
                      {strengthLabel}
                    </span>
                  </div>
                  {/* Strength Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>
                  {/* Requirements Checklist Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.minLength
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}
                    >
                      {passwordCriteria.minLength ? <Check className="w-3 h-3 text-emerald-400" /> : "•"}
                      8+ chars
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasUpper
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}
                    >
                      {passwordCriteria.hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : "•"}
                      Uppercase
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasLower
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}
                    >
                      {passwordCriteria.hasLower ? <Check className="w-3 h-3 text-emerald-400" /> : "•"}
                      Lowercase
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasNumber
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}
                    >
                      {passwordCriteria.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : "•"}
                      Number
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasSpecial
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}
                    >
                      {passwordCriteria.hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : "•"}
                      Special char
                    </span>
                  </div>
                </div>
              )}

              {passwordError && (
                <p id="password-error" className="text-[11px] text-rose-400 mt-1 pl-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* 6. Confirm Password (Requirement 7) */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-password-input" className="block text-xs font-semibold text-slate-300">
                Confirm Password <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="confirm-password-input"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) validateConfirmPassword(e.target.value, password);
                    if (generalError) setGeneralError("");
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword, password)}
                  placeholder="Re-enter your password"
                  aria-invalid={!!confirmPasswordError}
                  aria-describedby={confirmPasswordError ? "confirm-error" : undefined}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                    confirmPasswordError
                      ? "border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30"
                      : "border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p id="confirm-error" className="text-[11px] text-rose-400 mt-1 pl-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* 7. Terms & Privacy Checkbox (Requirement 8) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-start gap-2.5">
                <input
                  id="terms-checkbox"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (termsError) validateTerms(e.target.checked);
                  }}
                  className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950/80 text-sky-500 focus:ring-sky-500/40 focus:ring-offset-slate-900 cursor-pointer accent-sky-500"
                />
                <label htmlFor="terms-checkbox" className="text-xs text-slate-300 leading-snug cursor-pointer select-none">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalType("terms");
                    }}
                    className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalType("privacy");
                    }}
                    className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </label>
              </div>
              {termsError && (
                <p className="text-[11px] text-rose-400 pl-6">
                  {termsError}
                </p>
              )}
            </div>

            {/* 8. Primary Create Account Button (Requirement 9) */}
            <button
              type="submit"
              disabled={isSubmitting || isDemoSubmitting || signupSuccess}
              className="w-full relative flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : signupSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Account Created</span>
                </>
              ) : generalError ? (
                <>
                  <span>Try Again</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
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

          {/* Continue with Google (Requirement 17) */}
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

          {/* Continue in Demo Mode (Requirement 18 - clearly separated) */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => handleDemoLogin("Executive")}
              disabled={isDemoSubmitting || isSubmitting}
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
                    Explore MetricMind without creating a new corporate account.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400/70 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          {/* Already have an account? Sign in (Requirement 16) */}
          <div className="mt-5 pt-3.5 border-t border-slate-800/70 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="text-sky-400 hover:text-sky-300 font-semibold hover:underline underline-offset-2 transition-all cursor-pointer inline-flex items-center gap-1 group"
            >
              <span>Sign in</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
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
      <TermsPrivacyHelpModal
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:grid lg:grid-cols-12 selection:bg-sky-500/30 selection:text-sky-200">
      {/* LEFT SIDE: Brand / Product Showcase (5 cols on xl, 6 cols on lg) */}
      <div className="lg:col-span-6 xl:col-span-5 hidden lg:block">
        <BrandPanel />
      </div>

      {/* RIGHT SIDE: Centered Create Account Card (7 cols on xl, 6 cols on lg) */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center min-h-screen bg-slate-950/90 relative">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
