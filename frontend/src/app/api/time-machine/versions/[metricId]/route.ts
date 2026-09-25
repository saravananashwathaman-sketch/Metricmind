import { NextResponse } from "next/server";
import { HISTORICAL_METRIC_VERSIONS } from "@/lib/timeMachine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ metricId: string }> }
) {
  try {
    const { metricId } = await params;
    const versions = HISTORICAL_METRIC_VERSIONS[metricId];

    if (!versions) {
      return NextResponse.json(
        {
          metric_id: metricId,
          error: "Historical reconstruction unavailable for this period or metric.",
          versions: []
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      metric_id: metricId,
      versions,
      total_versions: versions.length,
      current_version: versions[versions.length - 1].version
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve metric versions" },
      { status: 500 }
    );
  }
}
