import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email = "" } = body;
    const cleanEmail = String(email).trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Security best practice: Never reveal if the email actually exists
    return NextResponse.json({
      success: true,
      message: "If the account exists, recovery instructions have been sent."
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process password reset request. Please try again later." },
      { status: 500 }
    );
  }
}
