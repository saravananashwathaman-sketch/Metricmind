import { NextResponse } from "next/server";
import { reconstructNumber } from "@/lib/timeMachine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ metricId: string }> }
) {
  try {
    const { metricId } = await params;
    const recon = reconstructNumber({ metricId });

    return NextResponse.json({
      metric_id: metricId,
      lineage: recon.lineage,
      dependencies: recon.dependency_graph,
      status: "verified"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve metric lineage" },
      { status: 500 }
    );
  }
}
