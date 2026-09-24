import { NextResponse } from "next/server";
import { getMetricDefinitions, updateMetricDefinition } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ metricName: string }> }
) {
  const { metricName } = await params;
  const metrics = getMetricDefinitions();
  const metric = metrics.find(
    (m) => m.metric_name.toLowerCase() === metricName.toLowerCase()
  );

  if (!metric) {
    return NextResponse.json(
      { error: `Metric '${metricName}' not found in governed catalog.` },
      { status: 404 }
    );
  }

  return NextResponse.json(metric);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ metricName: string }> }
) {
  const { metricName } = await params;
  const metrics = getMetricDefinitions();
  const metric = metrics.find(
    (m) => m.metric_name.toLowerCase() === metricName.toLowerCase()
  );

  if (!metric) {
    return NextResponse.json(
      { error: `Metric '${metricName}' not found.` },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const updated = updateMetricDefinition(metric.metric_id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
