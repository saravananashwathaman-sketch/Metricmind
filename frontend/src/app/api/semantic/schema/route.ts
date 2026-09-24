import { NextResponse } from "next/server";
import { getSemanticSchema } from "@/lib/semanticSchema";

/**
 * GET /api/semantic/schema
 * Exposes strict approved semantic schema (measures, dimensions, time dimensions, rules)
 * to the AI Agent.
 */
export async function GET() {
  const schema = getSemanticSchema();
  return NextResponse.json(schema, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      "X-Semantic-Layer": "Cube.dev",
      "X-Zero-Rogue-SQL": "Enforced"
    }
  });
}
