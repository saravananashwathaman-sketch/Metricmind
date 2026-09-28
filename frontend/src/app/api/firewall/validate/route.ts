import { NextResponse } from "next/server";
import { validateThroughFirewall } from "@/lib/firewallEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query || body.question;
    const userRole = body.user_role || "Executive";
    const semanticVersion = body.semantic_version;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          error: "Missing required 'query' or 'question' string in request body",
          status: "BLOCKED",
          cube_request_sent: false
        },
        { status: 400 }
      );
    }

    const decision = validateThroughFirewall(query, {
      userRole,
      semanticVersion
    });

    return NextResponse.json(decision);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Firewall execution failed",
        status: "BLOCKED",
        cube_request_sent: false
      },
      { status: 500 }
    );
  }
}
