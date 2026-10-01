/**
 * MetricMind Enterprise BI Design System Tokens
 * Governing colors, typography, cards, badges, and chart themes.
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    accent: "#06B6D4",
    secondaryAccent: "#8B5CF6",

    background: "#020617",
    surface: "#0F172A",
    card: "#1E293B",
    border: "#334155",
    borderHover: "#475569",

    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",

    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#0EA5E9",
  },
  charts: {
    palette: [
      "#4F46E5", // Primary Indigo
      "#06B6D4", // Cyan AI / Semantic
      "#10B981", // Emerald Success
      "#F59E0B", // Amber Warning
      "#8B5CF6", // Secondary Violet
      "#F43F5E", // Rose Danger
    ],
    backgroundColor: "#1E293B",
    gridLineColor: "#334155",
    axisLabelColor: "#94A3B8",
    tooltipBg: "rgba(15, 23, 42, 0.95)",
    tooltipBorder: "#334155",
    tooltipText: "#F8FAFC",
  },
  radii: {
    card: "14px",
    button: "10px",
    badge: "6px",
    input: "10px",
  }
} as const;

export type StatusType =
  | "verified"
  | "connected"
  | "passed"
  | "pending"
  | "review_required"
  | "blocked"
  | "failed"
  | "sandbox"
  | "demo"
  | "active"
  | "info";

export const STATUS_CONFIG: Record<
  StatusType,
  { label: string; dotColor: string; bg: string; text: string; border: string }
> = {
  verified: {
    label: "Verified",
    dotColor: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    text: "#10B981",
    border: "rgba(16, 185, 129, 0.25)",
  },
  connected: {
    label: "Connected",
    dotColor: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    text: "#10B981",
    border: "rgba(16, 185, 129, 0.25)",
  },
  passed: {
    label: "Passed",
    dotColor: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    text: "#10B981",
    border: "rgba(16, 185, 129, 0.25)",
  },
  active: {
    label: "Active",
    dotColor: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    text: "#10B981",
    border: "rgba(16, 185, 129, 0.25)",
  },
  pending: {
    label: "Pending",
    dotColor: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
    text: "#F59E0B",
    border: "rgba(245, 158, 11, 0.25)",
  },
  review_required: {
    label: "Review Required",
    dotColor: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
    text: "#F59E0B",
    border: "rgba(245, 158, 11, 0.25)",
  },
  blocked: {
    label: "Blocked",
    dotColor: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    text: "#EF4444",
    border: "rgba(239, 68, 68, 0.25)",
  },
  failed: {
    label: "Failed",
    dotColor: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    text: "#EF4444",
    border: "rgba(239, 68, 68, 0.25)",
  },
  sandbox: {
    label: "Sandbox",
    dotColor: "#0EA5E9",
    bg: "rgba(14, 165, 233, 0.1)",
    text: "#0EA5E9",
    border: "rgba(14, 165, 233, 0.25)",
  },
  demo: {
    label: "Demo",
    dotColor: "#0EA5E9",
    bg: "rgba(14, 165, 233, 0.1)",
    text: "#0EA5E9",
    border: "rgba(14, 165, 233, 0.25)",
  },
  info: {
    label: "Info",
    dotColor: "#0EA5E9",
    bg: "rgba(14, 165, 233, 0.1)",
    text: "#0EA5E9",
    border: "rgba(14, 165, 233, 0.25)",
  },
};
