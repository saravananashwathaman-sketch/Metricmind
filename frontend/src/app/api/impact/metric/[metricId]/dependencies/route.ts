import { NextResponse } from "next/server";
import {
  IMPACT_METRICS_CATALOG,
  GROSS_MARGIN_AFFECTED_ASSETS,
  GROSS_MARGIN_DEPENDENT_METRICS,
  evaluateImpactAssessment
} from "@/lib/impactSimulator";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ metricId: string }> }
) {
  try {
    const { metricId } = await params;
    const metric = IMPACT_METRICS_CATALOG[metricId] || IMPACT_METRICS_CATALOG.gross_margin;
    const affectedAssets = metricId === "gross_margin" ? GROSS_MARGIN_AFFECTED_ASSETS : [];
    const dependentMetrics = metricId === "gross_margin" ? GROSS_MARGIN_DEPENDENT_METRICS : [];
    const assessment = evaluateImpactAssessment(affectedAssets, dependentMetrics);

    return NextResponse.json({
      status: "success",
      metric_id: metric.id,
      metric_name: metric.display_name,
      current_version: metric.current_version,
      impact_assessment: assessment,
      dependent_metrics: dependentMetrics,
      affected_assets: affectedAssets,
      dashboards: affectedAssets.filter((a) => a.type === "dashboard"),
      reports: affectedAssets.filter((a) => a.type === "report"),
      saved_insights: affectedAssets.filter((a) => a.type === "saved_insight"),
      saved_queries: affectedAssets.filter((a) => a.type === "query"),
      alerts: affectedAssets.filter((a) => a.type === "alert"),
      api_consumers: affectedAssets.filter((a) => a.type === "api_consumer")
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve metric dependencies" },
      { status: 500 }
    );
  }
}
