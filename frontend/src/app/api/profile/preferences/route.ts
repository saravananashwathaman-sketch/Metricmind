import { NextResponse } from "next/server";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";

let preferencesState = {
  theme: DEFAULT_USER_PROFILE.theme,
  language: DEFAULT_USER_PROFILE.language,
  timezone: DEFAULT_USER_PROFILE.timezone,
  date_format: DEFAULT_USER_PROFILE.date_format,
  default_dashboard: DEFAULT_USER_PROFILE.default_dashboard,
  currency: DEFAULT_USER_PROFILE.currency,
  notifications: DEFAULT_USER_PROFILE.notifications
};

export async function GET() {
  return NextResponse.json(preferencesState);
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    preferencesState = {
      ...preferencesState,
      ...updates
    };
    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully.",
      preferences: preferencesState
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update preferences" }, { status: 500 });
  }
}
