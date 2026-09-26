import { NextResponse } from "next/server";
import { getAuditTrail } from "@/lib/impactSimulator";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auditTrail = getAuditTrail();
    const found = auditTrail.find((a) => a.simulation_id === id);

    if (!found) {
      return NextResponse.json(
        { error: `Simulation '${id}' not found in audit cache.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      simulation: found
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve simulation by ID" },
      { status: 500 }
    );
  }
}
