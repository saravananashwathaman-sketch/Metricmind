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

    // Return complete reconstruction payload including lineage, dependency graph, and metadata
    return NextResponse.json({
      ...recon,
      snapshot: {
        ...recon.snapshot,
        version: recon.snapshot.data_version
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to reconstruct metric" },
      { status: 500 }
    );
  }
}
