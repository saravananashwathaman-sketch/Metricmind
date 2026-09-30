import { NextResponse } from "next/server";
import { createUser, sanitizeUser } from "@/lib/userStore";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name = "",
      email = "",
      organization = "",
      jobTitle = "",
      job_title = "",
      department = "",
      password = ""
    } = body;

    // Call user store creation logic with validation and PBKDF2 hashing
    const result = createUser({
      name,
      email,
      organization,
      jobTitle: jobTitle || job_title,
      department,
      password
    });

    if (result.error || !result.user) {
      return NextResponse.json(
        { error: result.error || "Unable to create account. Please check your information." },
        { status: 400 }
      );
    }

    const sanitized = sanitizeUser(result.user);
    const token = `mm_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const expiresAt = Date.now() + 86400 * 1000; // 24 hours

    const response = NextResponse.json({
      success: true,
      token,
      expires_at: expiresAt,
      user: sanitized,
      message: "Account created successfully."
    });

    // Set authenticated session cookie
    response.cookies.set("mm_session_token", token, {
      path: "/",
      sameSite: "lax",
      maxAge: 86400,
      httpOnly: false
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "We couldn't create your account right now. Please try again." },
      { status: 500 }
    );
  }
}
