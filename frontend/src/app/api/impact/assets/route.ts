import { NextResponse } from "next/server";
import { GROSS_MARGIN_AFFECTED_ASSETS } from "@/lib/impactSimulator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search")?.toLowerCase();

    let assets = GROSS_MARGIN_AFFECTED_ASSETS;

    if (type && type !== "all") {
      assets = assets.filter((a) => a.type === type);
    }

    if (search) {
      assets = assets.filter(
        (a) =>
          a.name.toLowerCase().includes(search) ||
          a.impact_reason.toLowerCase().includes(search) ||
          a.owner.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      status: "success",
      count: assets.length,
      assets
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve impact assets" },
      { status: 500 }
    );
  }
}
