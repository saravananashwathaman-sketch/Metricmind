import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — MetricMind Enterprise BI",
  description: "Manage your personal information, preferences, and MetricMind account settings."
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
