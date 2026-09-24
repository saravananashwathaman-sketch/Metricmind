import { NextResponse } from "next/server";
import { getMetricDefinitions } from "@/lib/db";

export async function GET() {
  const metrics = getMetricDefinitions();
  return NextResponse.json(metrics);
}
