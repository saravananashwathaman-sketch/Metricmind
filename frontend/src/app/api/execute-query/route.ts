import { NextResponse } from "next/server";
import { validateSqlSafety, executeDatabaseQuery, logQueryAudit } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { sql, question, metric, dimensions } = await request.json();

    if (!sql) {
      return NextResponse.json({ error: "Missing 'sql' in request body" }, { status: 400 });
    }

    // 1. Enforce SQL Governance check
    const validation = validateSqlSafety(sql);
    if (!validation.isValid) {
      await logQueryAudit(
        question || "Ad-hoc SQL Execution",
        sql,
        metric || "unknown",
        dimensions || [],
        "BLOCKED",
        0,
        0,
        0.0,
        validation.reason || "BLOCKED_BY_POLICY"
      );

      return NextResponse.json(
        {
          error: "This query was blocked by MetricMind governance policies.",
          reason: validation.reason,
          blocked: true
        },
        { status: 403 }
      );
    }

    // 2. Execute against PostgreSQL / Governed Engine
    const result = await executeDatabaseQuery(sql);

    // 3. Record audit log
    await logQueryAudit(
      question || "Governed Query Execution",
      sql,
      metric || "semantic_sales",
      dimensions || [],
      "SUCCESS",
      result.executionTimeMs,
      result.rows.length,
      0.99,
      "PASSED_READ_ONLY_SEMANTIC"
    );

    return NextResponse.json({
      rows: result.rows,
      row_count: result.rows.length,
      execution_time_ms: result.executionTimeMs,
      source: result.source,
      status: "success"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
