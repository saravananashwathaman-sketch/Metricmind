import { NextResponse } from "next/server";
import { upsertGoogleUser, sanitizeUser, setCurrentProfile } from "@/lib/userStore";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";
import { AuthSession } from "@/types";

/**
 * Handles the Google OAuth 2.0 Authorization Callback.
 *
 * GET /api/auth/google/callback?code=...&state=...
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const oauthError = url.searchParams.get("error");

    // 1. Handle user cancellation or Google-side errors
    if (oauthError) {
      if (oauthError === "access_denied") {
        return NextResponse.redirect(new URL("/login?error=cancelled", request.url));
      }
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(oauthError)}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
    }

    // 2. Validate CSRF state parameter
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );

    const savedState = cookies["mm_oauth_state"];
    if (!savedState || savedState !== state) {
      console.warn("[Google OAuth] State mismatch / potential CSRF attempt.");
      return NextResponse.redirect(new URL("/login?error=invalid_state", request.url));
    }

    // 3. Retrieve Google Client Credentials (Server-side ONLY)
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId.includes("your_google_client_id") || clientSecret.includes("your-secret")) {
      return NextResponse.redirect(new URL("/login?error=not_configured", request.url));
    }

    // Determine redirect URI
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // 4. Exchange authorization code for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("[Google OAuth] Token exchange failed:", errText);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 5. Fetch user profile from Google UserInfo endpoint
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userinfoResponse.ok) {
      console.error("[Google OAuth] Failed to retrieve userinfo from Google.");
      return NextResponse.redirect(new URL("/login?error=userinfo_failed", request.url));
    }

    const googleUser = await userinfoResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=no_email_provided", request.url));
    }

    // 6. Upsert user in governed userStore (prevent duplicate accounts, link Google OAuth)
    const storedUser = upsertGoogleUser({
      sub: googleUser.sub,
      name: googleUser.name || googleUser.email.split("@")[0],
      email: googleUser.email,
      picture: googleUser.picture,
      email_verified: Boolean(googleUser.email_verified)
    });

    const sanitized = sanitizeUser(storedUser);

    // Synchronize active runtime profile
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
      avatar_url: storedUser.avatar_url,
      auth_provider: "google",
      status: storedUser.status,
      last_active: "Active Now"
    });

    // 7. Create application session
    const token = `mm_token_google_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const expiresAt = Date.now() + 30 * 86400 * 1000; // 30 days

    const authSession: AuthSession = {
      user: {
        id: sanitized.id,
        name: sanitized.name,
        email: sanitized.email,
        role: sanitized.role,
        initials: sanitized.initials,
        title: sanitized.title,
        department: sanitized.department,
        organization: sanitized.organization,
        avatar_url: sanitized.avatar_url,
        auth_provider: "google"
      },
      token,
      expires_at: expiresAt,
      is_demo: false
    };

    // 8. Retrieve and validate redirect URL (prevent open redirect vulnerabilities)
    let rawRedirect = cookies["mm_oauth_redirect"] || "/";
    if (!rawRedirect.startsWith("/") || rawRedirect.startsWith("//") || rawRedirect.includes("\\")) {
      rawRedirect = "/";
    }

    // 9. Deliver response setting HTTP-only cookie and client-side localStorage sync
    const htmlResponse = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating with Google...</title>
  <style>
    body { background: #020617; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #0f172a; border: 1px solid #1e293b; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 360px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .spinner { border: 3px solid #334155; border-top: 3px solid #38bdf8; border-radius: 50%; width: 28px; height: 28px; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem;">Google Authentication Successful</h3>
    <p style="margin: 0; color: #94a3b8; font-size: 0.8rem;">Entering MetricMind Executive Dashboard...</p>
  </div>
  <script>
    try {
      const session = ${JSON.stringify(authSession)};
      localStorage.setItem("metricmind_auth_session", JSON.stringify(session));
    } catch (e) {
      console.error("Storage error:", e);
    }
    window.location.replace("${rawRedirect}");
  </script>
</body>
</html>`;

    const response = new NextResponse(htmlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });

    // Set standard session cookie
    response.cookies.set("mm_session_token", token, {
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 86400,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production"
    });

    // Clear temporary OAuth cookies
    response.cookies.delete("mm_oauth_state");
    response.cookies.delete("mm_oauth_redirect");

    return response;
  } catch (error: any) {
    console.error("[Google OAuth Callback] Unexpected exception:", error);
    return NextResponse.redirect(new URL("/login?error=callback_failed", request.url));
  }
}
