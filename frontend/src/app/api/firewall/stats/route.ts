import { NextResponse } from "next/server";
import { INITIAL_FIREWALL_KPIS, INITIAL_FIREWALL_AUDIT_LOGS } from "@/lib/firewallEngine";

export async function GET() {
  return NextResponse.json({
    kpis: INITIAL_FIREWALL_KPIS,
    audit_logs: INITIAL_FIREWALL_AUDIT_LOGS
  });
}
