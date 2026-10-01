import { NextResponse } from "next/server";
import { queryCube } from "@/lib/cube";

export async function GET() {
  try {
    const res = await queryCube({
      measures: ["Sales.gross_margin", "Sales.revenue", "Sales.cost"],
      dimensions: ["Geography.region"]
    });

    return NextResponse.json({
      metric: "margin",
      formula: "((Revenue - Cost) / Revenue) * 100",
      source: res.metadata.source,
      data: res.data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
