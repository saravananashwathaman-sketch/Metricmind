import { NextResponse } from "next/server";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";
import { verifyUserPassword, sanitizeUser, setCurrentProfile } from "@/lib/userStore";

const MOCK_USERS_BY_EMAIL: Record<string, any> = {
  "ashwathaman@metricmind.com": {
    ...DEFAULT_USER_PROFILE,
    id: "user_ashwathaman",
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
    id: "user_priya",
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
    id: "user_admin",
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
    id: "user_devon",
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
    const cleanPassword = String(password || "").trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address (e.g. name@company.com)." },
        { status: 400 }
      );
    }

    // 1. Check userStore (contains seed accounts & newly registered accounts)
    const storedUser = cleanPassword ? verifyUserPassword(cleanEmail, cleanPassword) : null;
    if (storedUser) {
      const isDemo = cleanEmail === "demo@metricmind.app";
      const token = `mm_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      const expiresAt = Date.now() + (remember_me ? 30 * 86400 * 1000 : 86400 * 1000);
      const sanitized = sanitizeUser(storedUser);

      setCurrentProfile({
        ...DEFAULT_USER_PROFILE,
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        initials: storedUser.initials,
        role: storedUser.role,
        title: storedUser.job_title,
        job_title: storedUser.job_title,
        department: storedUser.department,
        organization: storedUser.organization,
        status: storedUser.status,
        last_active: "Active Now"
      });

      const response = NextResponse.json({
        success: true,
        token,
        expires_at: expiresAt,
        user: sanitized,
        is_demo: isDemo
      });

      response.cookies.set("mm_session_token", token, {
        path: "/",
        sameSite: "lax",
        maxAge: remember_me ? 30 * 86400 : 86400,
        httpOnly: false
      });

      return response;
    }

    // 2. Fallback check for predefined enterprise users
    if (MOCK_USERS_BY_EMAIL[cleanEmail]) {
      const u = MOCK_USERS_BY_EMAIL[cleanEmail];
      const isDemo = cleanEmail === "demo@metricmind.app";
      const token = `mm_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      const expiresAt = Date.now() + (remember_me ? 30 * 86400 * 1000 : 86400 * 1000);

      setCurrentProfile({
        ...DEFAULT_USER_PROFILE,
        ...u,
        last_active: "Active Now"
      });

      const response = NextResponse.json({
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
          job_title: u.title,
          department: u.department,
          organization: u.organization,
          status: "active"
        },
        is_demo: isDemo
      });

      response.cookies.set("mm_session_token", token, {
        path: "/",
        sameSite: "lax",
        maxAge: remember_me ? 30 * 86400 : 86400,
        httpOnly: false
      });

      return response;
    }

    // 3. ANY Custom Email ID Login (Instant Seamless Authentication)
    const emailPrefix = cleanEmail.split("@")[0].replace(/[._-]+/g, " ").trim();
    const displayName = emailPrefix
      ? emailPrefix
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Enterprise Executive";

    const initials =
      displayName
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0].toUpperCase())
        .slice(0, 2)
        .join("") || "EX";

    const domainPart = cleanEmail.split("@")[1] || "enterprise.com";
    const orgName = domainPart.replace(/\.[^/.]+$/, "").toUpperCase();

    const token = `mm_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const expiresAt = Date.now() + (remember_me ? 30 * 86400 * 1000 : 86400 * 1000);

    const customUser = {
      id: `usr_${Date.now().toString(36)}`,
      name: displayName,
      email: cleanEmail,
      role: "Executive" as const,
      initials,
      title: "Executive Vice President",
      job_title: "Executive Vice President",
      department: "Enterprise Analytics",
      organization: orgName === "GMAIL" || orgName === "YAHOO" ? "MetricMind Enterprise" : orgName,
      status: "active" as const
    };

    setCurrentProfile({
      ...DEFAULT_USER_PROFILE,
      ...customUser,
      last_active: "Active Now"
    });

    const response = NextResponse.json({
      success: true,
      token,
      expires_at: expiresAt,
      user: customUser,
      is_demo: false
    });

    response.cookies.set("mm_session_token", token, {
      path: "/",
      sameSite: "lax",
      maxAge: remember_me ? 30 * 86400 : 86400,
      httpOnly: false
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unable to complete login. Please try again." },
      { status: 500 }
    );
  }
}
