import { NextResponse } from "next/server";
import { executeDatabaseQuery } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        region_name,
        country,
        continent,
        ROUND(SUM(revenue), 2) AS revenue,
        ROUND(SUM(cost), 2) AS cost,
        ROUND(((SUM(revenue) - SUM(cost)) * 1.0 / NULLIF(SUM(revenue), 0)) * 100.0, 2) AS margin,
        COUNT(DISTINCT order_id) AS orders
      FROM semantic_sales
      GROUP BY region_name, country, continent
      ORDER BY revenue DESC;
    `;
    const res = await executeDatabaseQuery(sql);
    return NextResponse.json({
      data: res.rows,
      view: "semantic_sales"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
