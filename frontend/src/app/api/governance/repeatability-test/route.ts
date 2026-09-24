import { NextResponse } from "next/server";
import { runRepeatabilityTest } from "@/lib/cubeClient";

export async function POST(request: Request) {
  try {
    const { question = "Q3 Revenue" } = await request.json().catch(() => ({}));
    const result = await runRepeatabilityTest(question);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to execute repeatability test" },
      { status: 500 }
    );
  }
}
