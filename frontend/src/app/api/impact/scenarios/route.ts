import { NextResponse } from "next/server";
import { generateWhatIfScenarios } from "@/lib/impactSimulator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const metricId = body.metric || body.metric_id || "gross_margin";
    const formula = body.formula || "((Revenue - Cost - Logistics Cost) / Revenue) * 100";

    const scenarios = generateWhatIfScenarios(metricId, formula);

    return NextResponse.json({
      status: "success",
      metric_id: metricId,
      scenarios_count: scenarios.length,
      scenarios
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate what-if scenarios" },
      { status: 500 }
    );
  }
}
