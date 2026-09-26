import { NextResponse } from "next/server";
import { runMetricSimulation, validateProposedChange } from "@/lib/impactSimulator";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const metricId = body.metric || body.metric_id || "gross_margin";
    const changeType = body.proposed_change?.type || body.change_type || "formula_change";
    const proposedFormula =
      body.proposed_change?.formula ||
      body.proposed_definition?.formula ||
      body.formula ||
      "((Revenue - Cost - Logistics Cost) / Revenue) * 100";

    const scope = body.scope || body.simulation_scope || { region: "Europe", period: "Q3 2026" };
    const userName = body.user_name || "Rajesh Kapoor";

    // Run semantic governance validation
    const validation = validateProposedChange(metricId, proposedFormula, changeType);

    if (validation.blocked) {
      return NextResponse.json(
        {
          status: "blocked",
          metric: metricId,
          error: "SIMULATION_BLOCKED",
          reason: validation.block_reason,
          validation,
          simulation_only: true
        },
        { status: 422 }
      );
    }

    const result = runMetricSimulation(metricId, proposedFormula, changeType, scope, userName);

    return NextResponse.json({
      status: "success",
      simulation_id: result.simulation_id,
      metric: result.metric_id,
      metric_name: result.metric_name,
      current_value: result.current_value,
      simulated_value: result.simulated_value,
      difference: result.difference,
      difference_pp: result.difference_pp,
      affected_assets: result.impact_assessment.total_affected_assets,
      dependent_metrics: result.impact_assessment.dependent_metrics_count,
      simulation_only: true, // Strict sandbox flag
      is_demo_mode: true,
      simulation: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to execute metric impact simulation" },
      { status: 500 }
    );
  }
}
