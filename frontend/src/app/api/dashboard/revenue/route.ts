import { NextResponse } from "next/server";
import { executeDatabaseQuery } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        continent,
        country,
        ROUND(SUM(revenue), 2) AS revenue,
        ROUND(SUM(cost), 2) AS cost
      FROM semantic_sales
      GROUP BY continent, country
      ORDER BY revenue DESC;
    `;
    const res = await executeDatabaseQuery(sql);
    return NextResponse.json({
      metric: "revenue",
      formula: "SUM(quantity * unit_price * (1 - discount/100))",
      data: res.rows
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
