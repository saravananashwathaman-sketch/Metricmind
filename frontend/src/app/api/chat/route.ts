import { NextResponse } from "next/server";
import { runMetricMindAgent } from "@/lib/agentOrchestrator";

export async function POST(request: Request) {
  try {
    const { question, user_role = "Executive" } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing valid 'question' in body" }, { status: 400 });
    }

    const { chatResponse, trace } = await runMetricMindAgent(question, user_role);

    return NextResponse.json({
      ...chatResponse,
      _trace: trace
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "An unexpected error occurred during semantic query execution",
        status: "BLOCKED"
      },
      { status: 400 }
    );
  }
}
