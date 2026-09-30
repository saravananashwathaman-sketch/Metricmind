import { NextResponse } from "next/server";
import { getCurrentProfile, setCurrentProfile } from "@/lib/userStore";

export async function GET() {
  const profile = getCurrentProfile();
  return NextResponse.json(profile, {
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

    const currentProfile = getCurrentProfile();
    // Compute initials if name was provided
    let initials = currentProfile.initials;
    if (updates.name) {
      initials = updates.name
        .trim()
        .split(/\s+/)
        .map((part: string) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "A";
    }

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      initials,
      last_active: "Just now"
    };
    setCurrentProfile(updatedProfile);

    return NextResponse.json(updatedProfile, {
      status: 200,
      headers: { "Cache-Control": "no-store" }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update profile" }, { status: 500 });
  }
}
