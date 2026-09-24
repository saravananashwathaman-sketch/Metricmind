import { NextResponse } from "next/server";
import { executeCubeQuery } from "@/lib/cubeClient";
import { detectSqlHallucination } from "@/lib/semanticSchema";

/**
 * POST /api/semantic/query
 * Executes a governed semantic query via the Cube.dev Adapter
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if the agent mistakenly sent raw SQL
    const bodyStr = JSON.stringify(body);
    const sqlCheck = detectSqlHallucination(bodyStr);
    if (sqlCheck.isHallucinatingSql) {
      return NextResponse.json(
        {
          success: false,
          error: sqlCheck.explanation,
          sql_hallucination_detected: true,
          status: "BLOCKED_BY_GOVERNANCE_GATEWAY"
        },
        { status: 400 }
      );
    }

    const result = await executeCubeQuery(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Semantic query processing error",
        status: "ERROR"
      },
      { status: 500 }
    );
  }
}
