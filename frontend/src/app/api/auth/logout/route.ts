import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully"
  });

  // Clear session cookie if any
  response.cookies.delete("mm_session_token");

  return response;
}
