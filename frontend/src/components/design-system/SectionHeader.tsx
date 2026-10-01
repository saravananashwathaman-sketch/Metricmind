"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  level?: "page" | "section";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  level = "page",
  className = "",
}) => {
  const isPage = level === "page";

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#334155] ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          {isPage ? (
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {title}
            </h1>
          ) : (
            <h2 className="text-lg sm:text-xl font-semibold text-[#F8FAFC] tracking-tight">
              {title}
            </h2>
          )}
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
