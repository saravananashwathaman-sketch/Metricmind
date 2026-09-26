import { NextResponse } from "next/server";
import { IMPACT_METRICS_CATALOG } from "@/lib/impactSimulator";

export async function GET() {
  try {
    const metrics = Object.values(IMPACT_METRICS_CATALOG);
    return NextResponse.json({
      status: "success",
      count: metrics.length,
      metrics
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve impact metrics" },
      { status: 500 }
    );
  }
}
