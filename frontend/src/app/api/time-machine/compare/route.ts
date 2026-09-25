import { NextResponse } from "next/server";
import { compareTwoMoments } from "@/lib/timeMachine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const metricId = body.metricId || body.metric_id || "gross_margin";
    const periodA = body.periodA || body.period_a || "Q3 2026";
    const periodB = body.periodB || body.period_b || "Q3 2025";

    const comparison = compareTwoMoments(metricId, periodA, periodB);

    return NextResponse.json(comparison, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to execute historical comparison" },
      { status: 500 }
    );
  }
}
