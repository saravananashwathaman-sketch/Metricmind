import { NextResponse } from "next/server";
import { queryCube } from "@/lib/cube";

export async function GET() {
  try {
    const res = await queryCube({
      measures: ["Sales.revenue", "Sales.cost", "Sales.gross_margin", "Sales.order_count"],
      dimensions: ["Geography.region", "Geography.country"]
    });

    return NextResponse.json({
      data: res.data,
      source: res.metadata.source,
      model: "Sales Cube (Geography)"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
