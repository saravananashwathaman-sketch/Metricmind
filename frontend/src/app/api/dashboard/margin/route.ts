import { NextResponse } from "next/server";
import { executeDatabaseQuery } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        continent,
        ROUND(SUM(revenue), 2) AS revenue,
        ROUND(SUM(cost), 2) AS cost,
        ROUND(((SUM(revenue) - SUM(cost)) * 1.0 / NULLIF(SUM(revenue), 0)) * 100.0, 2) AS margin
      FROM semantic_sales
      GROUP BY continent
      ORDER BY margin DESC;
    `;
    const res = await executeDatabaseQuery(sql);
    return NextResponse.json({
      metric: "margin",
      formula: "((Revenue - Cost) / Revenue) * 100",
      data: res.rows
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
