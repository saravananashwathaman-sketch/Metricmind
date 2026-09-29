import { NextResponse } from "next/server";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";

const MOCK_USERS_BY_EMAIL: Record<string, any> = {
  "ashwathaman@metricmind.com": {
    ...DEFAULT_USER_PROFILE,
    name: "Ashwathaman",
    email: "ashwathaman@metricmind.com",
    role: "Executive",
    initials: "A",
    title: "Executive Vice President",
    department: "Business Analytics",
    organization: "MetricMind Enterprise"
  },
  "demo@metricmind.app": {
    ...DEFAULT_USER_PROFILE,
    id: "user_demo",
    name: "Rajesh Kapoor",
    email: "demo@metricmind.app",
    role: "Executive",
    initials: "RK",
    title: "Executive Vice President (Demo)",
    department: "Business Analytics",
    organization: "MetricMind Enterprise"
  },
  "priya.sharma@metricmind.com": {
    ...DEFAULT_USER_PROFILE,
    name: "Priya Sharma",
    email: "priya.sharma@metricmind.com",
    role: "Finance Analyst",
    initials: "PS",
    title: "VP Strategic Finance",
    department: "Strategic Finance",
    organization: "MetricMind Enterprise"
  },
  "admin@metricmind.com": {
    ...DEFAULT_USER_PROFILE,
    name: "Vikram Malhotra",
    email: "admin@metricmind.com",
    role: "Admin",
    initials: "VM",
    title: "Chief Data Architect & Admin",
    department: "Data Governance & Infrastructure",
    organization: "MetricMind Enterprise"
  },
  "devon.clark@metricmind.com": {
    ...DEFAULT_USER_PROFILE,
    name: "Devon Clark",
    email: "devon.clark@metricmind.com",
    role: "Sales Analyst",
    initials: "DC",
    title: "Lead Commercial Operations Analyst",
    department: "Commercial Operations",
    organization: "MetricMind Enterprise"
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email = "", password = "", remember_me = false } = body;
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!cleanPassword) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    // 1. Matched predefined enterprise user
    if (MOCK_USERS_BY_EMAIL[cleanEmail]) {
      const u = MOCK_USERS_BY_EMAIL[cleanEmail];
      const isDemo = cleanEmail === "demo@metricmind.app";
      const token = `mm_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      const expiresAt = Date.now() + (remember_me ? 30 * 86400 * 1000 : 86400 * 1000);

      return NextResponse.json({
        success: true,
        token,
        expires_at: expiresAt,
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          initials: u.initials,
          title: u.title,
          department: u.department,
          organization: u.organization
        },
        is_demo: isDemo
      });
    }

    // 2. Generic enterprise domain user (e.g. employee@company.com)
    if (cleanPassword.length >= 6) {
      const parts = cleanEmail.split("@")[0].replace(/[._-]+/g, " ").trim();
      const displayName = parts
        ? parts.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : "Enterprise User";
      const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0].toUpperCase())
        .slice(0, 2)
        .join("") || "EU";

      const token = `mm_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      const expiresAt = Date.now() + (remember_me ? 30 * 86400 * 1000 : 86400 * 1000);

      return NextResponse.json({
        success: true,
        token,
        expires_at: expiresAt,
        user: {
          id: `usr_${Date.now().toString(36)}`,
          name: displayName,
          email: cleanEmail,
          role: "Executive",
          initials,
          title: "Enterprise Member",
          department: "Business Analytics",
          organization: cleanEmail.split("@")[1].replace(/\.[^/.]+$/, "").toUpperCase()
        },
        is_demo: false
      });
    }

    return NextResponse.json(
      { error: "Unable to sign in. Please check your credentials and try again." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unable to connect to the authentication service. Please try again." },
      { status: 500 }
    );
  }
}
