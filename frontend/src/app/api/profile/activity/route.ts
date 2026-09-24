import { NextResponse } from "next/server";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    activity: DEFAULT_USER_PROFILE.activity,
    recent_sessions: [
      {
        device: "Chrome / Windows 11 Enterprise",
        ip: "10.16.237.35",
        location: "Bengaluru, India",
        status: "Current Active Session",
        is_current: true
      },
      {
        device: "MetricMind Executive Mobile (iOS 18)",
        ip: "49.37.12.8",
        location: "Bengaluru, India",
        status: "Active 4 hours ago",
        is_current: false
      }
    ]
  });
}
