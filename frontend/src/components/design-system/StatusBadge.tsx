"use client";

import React from "react";
import { STATUS_CONFIG, StatusType } from "@/lib/designSystem";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "sm",
  className = "",
}) => {
  const normalizedKey = (status.toLowerCase().replace(/\s+/g, "_") as StatusType);
  const config = STATUS_CONFIG[normalizedKey] || {
    label: status,
    dotColor: "#94A3B8",
    bg: "rgba(148, 163, 184, 0.1)",
    text: "#94A3B8",
    border: "rgba(148, 163, 184, 0.2)",
  };

  const displayText = label || config.label;
  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium tracking-wide border transition-colors ${
        isSmall ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.dotColor }}
      />
      <span>{displayText}</span>
    </span>
  );
};
