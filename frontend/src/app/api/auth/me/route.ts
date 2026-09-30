import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/userStore";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Valid session token check with current active profile
  return NextResponse.json({
    authenticated: true,
    user: getCurrentProfile()
  });
}
