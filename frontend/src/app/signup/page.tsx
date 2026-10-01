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
  // SUCCESS SCREEN
  // ========================================================
  if (signupSuccess && createdUser) {
    return (
      <div className="flex flex-col justify-between min-h-full p-6 sm:p-10 lg:p-14 bg-[#020617]">
        {/* Top Mobile Brand Bar */}
        <div className="flex lg:hidden items-center justify-between pb-6 mb-2 border-b border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div>
              <span className="font-bold text-sm text-[#F8FAFC]">METRICMIND</span>
              <span className="block text-[10px] text-[#64748B]">Agentic Semantic BI</span>
            </div>
          </div>
        </div>

        {/* Success Card */}
        <div className="w-full max-w-lg mx-auto my-auto py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl bg-[#1E293B] border border-[#334155] p-7 sm:p-9 shadow-lg text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center mx-auto text-[#10B981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
                Welcome to MetricMind
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                Your account has been created successfully.
              </p>
            </div>

            {/* Account Summary Card */}
            <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                <span className="text-[11px] font-medium text-[#94A3B8]">Account Summary</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-mono">
                    Full Name
                  </span>
                  <span className="font-semibold text-[#F8FAFC]">{createdUser.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-mono">
                    Work Email
                  </span>
                  <span className="font-mono text-[#94A3B8] text-[11px] truncate block">
                    {createdUser.email}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-mono">
                    Organization
                  </span>
                  <span className="font-semibold text-[#F8FAFC]">
                    {createdUser.organization || organization}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#64748B] font-mono">
                    Initial Role
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#4F46E5]/15 text-[#818CF8] border border-[#4F46E5]/30 text-[11px] font-medium inline-block">
                    {createdUser.role || "Executive"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#334155] flex items-center gap-2 text-[11px] text-[#94A3B8]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
                <span>Governed semantic catalog access enabled for your tenant.</span>
              </div>
            </div>

            {/* Email Verification Architecture Notice */}
            <div className="p-3 rounded-xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/25 text-left text-xs text-[#0EA5E9] flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-[#F8FAFC]">Email Verification Ready</span>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Account created successfully. Check your email if domain verification is required by your enterprise administrator, or visit{" "}
                  <Link href="/verify-email" className="underline font-semibold text-[#06B6D4] hover:text-[#38bdf8]">
                    /verify-email
                  </Link>.
                </p>
              </div>
            </div>

            {/* Continue to MetricMind Button */}
            <button
              type="button"
              onClick={() => router.push(redirectUrl)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-[#F8FAFC] font-semibold text-xs sm:text-sm tracking-wide shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Continue to MetricMind</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full pt-4 border-t border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div>&copy; 2026 MetricMind Enterprise. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setModalType("privacy")} className="hover:text-[#94A3B8] transition-colors cursor-pointer">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => setModalType("terms")} className="hover:text-[#94A3B8] transition-colors cursor-pointer">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => setModalType("help")} className="hover:text-[#94A3B8] transition-colors cursor-pointer">
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
    <div className="flex flex-col justify-between min-h-full p-6 sm:p-10 lg:p-14 bg-[#020617]">
      {/* Top Mobile Brand Bar (Only on small screens) */}
      <div className="flex lg:hidden items-center justify-between pb-6 mb-2 border-b border-[#334155]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div>
            <span className="font-bold text-sm text-[#F8FAFC]">
              METRICMIND
            </span>
            <span className="block text-[10px] text-[#64748B]">Agentic Semantic BI</span>
          </div>
        </div>
        <Link
          href="/login"
          className="text-xs px-2.5 py-1 rounded-lg bg-[#1E293B] text-[#94A3B8] border border-[#334155] font-medium hover:text-[#F8FAFC] transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Centered Signup Card */}
      <div className="w-full max-w-lg mx-auto my-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-2xl bg-[#1E293B] border border-[#334155] p-7 sm:p-9 shadow-lg"
        >
          {/* Heading & Subtitle */}
          <div className="space-y-1.5 text-left mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Create your MetricMind account
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
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
                className="mb-5 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444] mt-0.5" />
                <span className="leading-snug">{generalError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* 1. Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullname-input" className="block text-xs font-semibold text-[#F8FAFC]">
                Full Name <span className="text-[#06B6D4]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
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
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#020617] border text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all ${
                    nameError
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                      : "border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20"
                  }`}
                />
              </div>
              {nameError && (
                <p id="name-error" className="text-[11px] text-[#EF4444] mt-1 pl-1">
                  {nameError}
                </p>
              )}
            </div>

            {/* 2. Work Email */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="block text-xs font-semibold text-[#F8FAFC]">
                Work Email <span className="text-[#06B6D4]">*</span>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                    if (generalError) setGeneralError("");
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="you@company.com"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#020617] border text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all ${
                    emailError
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                      : "border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20"
                  }`}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-[11px] text-[#EF4444] mt-1 pl-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* 3. Organization & Job Title (2 columns on sm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Organization */}
              <div className="space-y-1.5">
                <label htmlFor="org-input" className="block text-xs font-semibold text-[#F8FAFC]">
                  Organization <span className="text-[#06B6D4]">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
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
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#020617] border text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all ${
                      organizationError
                        ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                        : "border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20"
                    }`}
                  />
                </div>
                {organizationError && (
                  <p id="org-error" className="text-[11px] text-[#EF4444] mt-1 pl-1">
                    {organizationError}
                  </p>
                )}
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label htmlFor="title-input" className="block text-xs font-semibold text-[#F8FAFC]">
                  Job Title <span className="text-[#06B6D4]">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
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
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#020617] border text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all ${
                      jobTitleError
                        ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                        : "border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20"
                    }`}
                  />
                </div>
                {jobTitleError && (
                  <p id="title-error" className="text-[11px] text-[#EF4444] mt-1 pl-1">
                    {jobTitleError}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Department (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="dept-input" className="block text-xs font-semibold text-[#F8FAFC]">
                  Department
                </label>
                <span className="text-[10px] text-[#64748B]">Optional</span>
              </div>
              <div className="relative">
                <Layers className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="dept-input"
                  name="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Finance or Strategic Planning"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#020617] border border-[#334155] text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 5. Password */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="block text-xs font-semibold text-[#F8FAFC]">
                Password <span className="text-[#06B6D4]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
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
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#020617] border text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all ${
                    passwordError
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                      : "border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20"
                  }`}
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

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="pt-1.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#94A3B8]">Password Strength</span>
                    <span className={`font-semibold ${strengthTextColor}`}>
                      {strengthLabel}
                    </span>
                  </div>
                  {/* Strength Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#0F172A] overflow-hidden">
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
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                          : "bg-[#020617] text-[#64748B] border-[#334155]"
                      }`}
                    >
                      {passwordCriteria.minLength ? <Check className="w-3 h-3 text-[#10B981]" /> : "•"}
                      8+ chars
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasUpper
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                          : "bg-[#020617] text-[#64748B] border-[#334155]"
                      }`}
                    >
                      {passwordCriteria.hasUpper ? <Check className="w-3 h-3 text-[#10B981]" /> : "•"}
                      Uppercase
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasLower
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                          : "bg-[#020617] text-[#64748B] border-[#334155]"
                      }`}
                    >
                      {passwordCriteria.hasLower ? <Check className="w-3 h-3 text-[#10B981]" /> : "•"}
                      Lowercase
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasNumber
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                          : "bg-[#020617] text-[#64748B] border-[#334155]"
                      }`}
                    >
                      {passwordCriteria.hasNumber ? <Check className="w-3 h-3 text-[#10B981]" /> : "•"}
                      Number
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                        passwordCriteria.hasSpecial
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                          : "bg-[#020617] text-[#64748B] border-[#334155]"
                      }`}
                    >
                      {passwordCriteria.hasSpecial ? <Check className="w-3 h-3 text-[#10B981]" /> : "•"}
                      Special char
                    </span>
                  </div>
                </div>
              )}

              {passwordError && (
                <p id="password-error" className="text-[11px] text-[#EF4444] mt-1 pl-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* 6. Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-password-input" className="block text-xs font-semibold text-[#F8FAFC]">
                Confirm Password <span className="text-[#06B6D4]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3 pointer-events-none" />
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
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#020617] border text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-all ${
                    confirmPasswordError
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                      : "border-[#334155] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 p-1 text-[#64748B] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p id="confirm-error" className="text-[11px] text-[#EF4444] mt-1 pl-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* 7. Terms & Privacy Checkbox */}
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
                  className="w-4 h-4 mt-0.5 rounded border-[#334155] bg-[#020617] text-[#4F46E5] focus:ring-[#4F46E5]/40 cursor-pointer accent-[#4F46E5]"
                />
                <label htmlFor="terms-checkbox" className="text-xs text-[#94A3B8] leading-snug cursor-pointer select-none">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalType("terms");
                    }}
                    className="text-[#06B6D4] hover:text-[#38bdf8] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
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
                    className="text-[#06B6D4] hover:text-[#38bdf8] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </label>
              </div>
              {termsError && (
                <p className="text-[11px] text-[#EF4444] pl-6">
                  {termsError}
                </p>
              )}
            </div>

            {/* 8. Primary Create Account Button */}
            <button
              type="submit"
              disabled={isSubmitting || isDemoSubmitting || signupSuccess}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-[#F8FAFC] font-semibold text-xs sm:text-sm tracking-wide shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : signupSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
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
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#020617] border border-[#334155] hover:border-[#475569] text-[#F8FAFC] text-xs font-semibold transition-colors shadow-sm cursor-pointer"
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

          {/* Continue in Demo Mode */}
          <div className="mt-4 pt-4 border-t border-[#334155]">
            <button
              type="button"
              onClick={() => handleDemoLogin("Executive")}
              disabled={isDemoSubmitting || isSubmitting}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0F172A] hover:bg-[#020617] border border-[#F59E0B]/30 text-[#F8FAFC] transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F8FAFC]">
                      Continue in Demo Mode
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 uppercase font-semibold">
                      DEMO MODE
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">
                    Explore MetricMind without creating a new corporate account.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          {/* Already have an account? Sign in */}
          <div className="mt-5 pt-3.5 border-t border-[#334155] text-center text-xs text-[#94A3B8]">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="text-[#4F46E5] hover:text-[#818CF8] font-semibold transition-colors inline-flex items-center gap-1"
            >
              <span>Sign in</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full pt-4 border-t border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
        <div>&copy; 2026 MetricMind Enterprise. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setModalType("privacy")}
            className="hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <span>•</span>
          <button
            onClick={() => setModalType("terms")}
            className="hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            Terms
          </button>
          <span>•</span>
          <button
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
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col lg:grid lg:grid-cols-12">
      {/* LEFT SIDE: Brand / Product Showcase */}
      <div className="lg:col-span-6 xl:col-span-5 hidden lg:block border-r border-[#334155]">
        <BrandPanel />
      </div>

      {/* RIGHT SIDE: Centered Create Account Card */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center min-h-screen bg-[#020617]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-[#94A3B8]">
              <Loader2 className="w-6 h-6 animate-spin text-[#4F46E5]" />
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
