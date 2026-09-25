import { NextResponse } from "next/server";
import { reproduceNumber } from "@/lib/timeMachine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const metricId = body.metricId || body.metric_id || "gross_margin";
    const fingerprint = body.fingerprint;

    const result = reproduceNumber(metricId, fingerprint);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to reproduce number" },
      { status: 500 }
    );
  }
}
