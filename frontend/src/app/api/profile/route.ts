import { NextResponse } from "next/server";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";
import { UserProfile } from "@/types";

// In-memory runtime profile state for local / demo mode
let currentProfile: UserProfile = { ...DEFAULT_USER_PROFILE };

export async function GET() {
  return NextResponse.json(currentProfile, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "X-MetricMind-Profile": "Active"
    }
  });
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();

    if (updates.name !== undefined) {
      if (!updates.name || typeof updates.name !== "string" || !updates.name.trim()) {
        return NextResponse.json({ error: "Full Name cannot be empty" }, { status: 400 });
      }
    }

    if (updates.email !== undefined) {
      if (!updates.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        return NextResponse.json({ error: "Please provide a valid corporate email address" }, { status: 400 });
      }
    }

    // Compute initials if name was provided
    let initials = currentProfile.initials;
    if (updates.name) {
      initials = updates.name
        .trim()
        .split(/\s+/)
        .map((part: string) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "RK";
    }

    currentProfile = {
      ...currentProfile,
      ...updates,
      initials,
      last_active: "Just now"
    };

    return NextResponse.json(currentProfile, {
      status: 200,
      headers: { "Cache-Control": "no-store" }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update profile" }, { status: 500 });
  }
}
