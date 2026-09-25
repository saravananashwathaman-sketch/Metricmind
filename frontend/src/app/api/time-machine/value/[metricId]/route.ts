import { NextResponse } from "next/server";
import { reconstructNumber } from "@/lib/timeMachine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ metricId: string }> }
) {
  try {
    const { metricId } = await params;
    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version") || undefined;
    const period = searchParams.get("period") || "Q3 2026";
    const region = searchParams.get("region") || "Europe";

    const recon = reconstructNumber({ metricId, version, period, region });

    return NextResponse.json({
      metric_id: metricId,
      metric_name: recon.metric.name,
      value: recon.value,
      period: recon.period,
      components: recon.components,
      formatted_components: recon.formatted_components,
      calculation_flow: recon.calculation_flow,
      governance: recon.governance
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve metric value" },
      { status: 500 }
    );
  }
}
