import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Initiates the Google OAuth 2.0 Authorization Flow.
 *
 * GET /api/auth/google?redirect=/dashboard
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get("redirect") || "/";

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Check if Google OAuth credentials are configured
    if (!clientId || clientId.includes("your_google_client_id")) {
      return NextResponse.redirect(
        new URL("/login?error=not_configured", request.url)
      );
    }

    // Determine host origin for callback
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Generate cryptographically secure state parameter to prevent CSRF
    const state = crypto.randomBytes(24).toString("hex");

    // Build standard Google OAuth authorization URL
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    const response = NextResponse.redirect(googleAuthUrl.toString());

    // Secure HTTP-only cookies for state and redirect validation (10 min expiry)
    response.cookies.set("mm_oauth_state", state, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 600,
      secure: process.env.NODE_ENV === "production"
    });

    response.cookies.set("mm_oauth_redirect", redirectUrl, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 600,
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (error: any) {
    console.error("[Google OAuth] Initiation error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_init_failed", request.url));
  }
}
