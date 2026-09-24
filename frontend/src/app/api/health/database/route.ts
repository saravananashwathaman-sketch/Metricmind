import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db";

export async function GET() {
  try {
    const health = await checkDatabaseHealth();
    return NextResponse.json(health);
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        database: "PostgreSQL",
        connected: false,
        error: "Unable to connect to the analytics database."
      },
      { status: 500 }
    );
  }
}
