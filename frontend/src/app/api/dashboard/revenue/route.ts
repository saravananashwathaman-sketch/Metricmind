import { NextResponse } from "next/server";
import { queryCube } from "@/lib/cube";

export async function GET() {
  try {
    const res = await queryCube({
      measures: ["Sales.revenue", "Sales.cost"],
      dimensions: ["Geography.region", "Geography.country"]
    });

    return NextResponse.json({
      metric: "revenue",
      formula: "SUM(fct_sales.revenue)",
      source: res.metadata.source,
      data: res.data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
