"use client";

import React from "react";
import { X, ShieldAlert, KeyRound, ExternalLink, CheckCircle } from "lucide-react";

interface GoogleSsoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSsoModal: React.FC<GoogleSsoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-sso-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            {/* Google G logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          </div>
          <div>
            <h3 id="google-sso-title" className="text-base font-bold text-slate-100">
              Google Workspace SSO
            </h3>
            <p className="text-xs text-slate-400">Enterprise Single Sign-On</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>OAuth Client Setup Required</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Google Single Sign-On requires configuring your enterprise Google Cloud OAuth 2.0 client
            in the MetricMind backend settings.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1">
            <div className="text-slate-500"># Required environment variables:</div>
            <div>GOOGLE_CLIENT_ID=&quot;your-id.apps.googleusercontent.com&quot;</div>
            <div>GOOGLE_CLIENT_SECRET=&quot;your-secret-key&quot;</div>
            <div>GOOGLE_ALLOWED_DOMAIN=&quot;yourcompany.com&quot;</div>
          </div>
        </div>

        <div className="text-xs text-slate-400 space-y-1.5">
          <p className="font-medium text-slate-300">Quick Testing Options:</p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Use <strong>Continue in Demo Mode</strong> for instant access</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-sky-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Sign in with <strong>demo@metricmind.app</strong></span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
