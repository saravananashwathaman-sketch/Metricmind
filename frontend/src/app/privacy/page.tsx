"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign Up</span>
          </Link>
          <span className="text-xs font-mono text-slate-500">SOC2 Type II Certified</span>
        </div>

        <div className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Enterprise Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: January 1, 2026 • MetricMind Enterprise
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-100">
              1. Zero Direct SQL Exposure
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              MetricMind implements zero-trust data isolation. All business intelligence queries execute strictly through the governed semantic layer. Customer warehouse raw tables, connection credentials, and schemas are never exposed to LLM endpoints.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-100">
              2. No AI Training on Customer Data
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Your organizational queries, aggregated transaction figures, and financial insights are never utilized to train AI models. Processing occurs in isolated tenant execution spaces with cryptographic audit trails.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-100">
              3. Data Encryption & Session Security
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              All data in transit is encrypted using TLS 1.3. User passwords are encrypted with salted PBKDF2 cryptographic hashing. Sensitive dimension filters and row-level security tokens are enforced on every analytical retrieval.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-100">
              4. Data Retention & Audit Rights
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Enterprise administrators retain comprehensive audit visibility over all query logs, verification signatures, and lineage modifications via the MetricMind Governance and Trust Center.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
