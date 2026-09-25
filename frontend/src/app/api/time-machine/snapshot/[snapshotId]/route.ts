import { NextResponse } from "next/server";
import { DATA_SNAPSHOT_REGISTRY } from "@/lib/timeMachine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ snapshotId: string }> }
) {
  try {
    const { snapshotId } = await params;
    const snapshot = DATA_SNAPSHOT_REGISTRY[snapshotId];

    if (!snapshot) {
      return NextResponse.json(
        {
          snapshot_id: snapshotId,
          error: "Snapshot not found or historical data archive unavailable.",
          status: "NOT_FOUND"
        },
        { status: 404 }
      );
    }

    return NextResponse.json(snapshot);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve data snapshot" },
      { status: 500 }
    );
  }
}
