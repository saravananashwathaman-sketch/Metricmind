import { NextResponse } from "next/server";
import { validateSqlSafety } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { sql } = await request.json();
    if (!sql) {
      return NextResponse.json({ error: "Missing 'sql' in request body" }, { status: 400 });
    }

    const validation = validateSqlSafety(sql);
    return NextResponse.json({
      sql,
      is_valid: validation.isValid,
      reason: validation.reason || "Query complies with MetricMind read-only governance policies.",
      target_view: "semantic_sales"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
