import { NextResponse } from "next/server";
import { checkDatabaseHealth, getAuditLogs } from "@/lib/db";

export async function GET() {
  try {
    const health = await checkDatabaseHealth();
    const auditLogs = getAuditLogs();
    return NextResponse.json({
      ...health,
      audit_logs: auditLogs.slice(0, 50)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
