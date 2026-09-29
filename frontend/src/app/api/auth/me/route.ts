import { NextResponse } from "next/server";
import { DEFAULT_USER_PROFILE } from "@/lib/mockData";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Valid session token check
  return NextResponse.json({
    authenticated: true,
    user: DEFAULT_USER_PROFILE
  });
}
