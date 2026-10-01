import { runAdvancedMetricMindAgent } from "../agentOrchestrator";
import { QueryBudgetTracker, validateQueryComplexity, GOVERNANCE_CONFIG } from "../queryGovernance";

async function runAllTests() {
  console.log("=================================================");
  console.log("METRICMIND ADVANCED AGENT UPGRADE: ACCEPTANCE TESTS");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(testNum: number, condition: boolean, description: string) {
    if (condition) {
      console.log(`[PASS] TEST ${testNum}: ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] TEST ${testNum}: ${description}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: User asks "Why did European margins drop last quarter?"
  // Expected: Primary query + Secondary driver query + Root-cause analysis
  // -------------------------------------------------------------
  try {
    const res1 = await runAdvancedMetricMindAgent("Why did European margins drop last quarter?");
    const hasPrimaryMetric = res1.governed_metric.id === "gross_margin";
    const hasDrivers = res1.drivers.length > 0;
    const hasRootCause = res1.executive_summary.includes("contributing factors") || res1.executive_summary.includes("increased logistics");
    const queriesCount = res1.queries?.count ?? 0;
    assert(
      1,
      hasPrimaryMetric && hasDrivers && hasRootCause && queriesCount >= 2,
      "Multi-step analysis executed with primary metric, secondary cost drivers breakdown, and non-causal root-cause narrative."
    );
  } catch (e: any) {
    assert(1, false, `Error in TEST 1: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 2: User: "Show revenue by quarter."
  // Expected: Line chart
  // -------------------------------------------------------------
  try {
    const res2 = await runAdvancedMetricMindAgent("Show revenue by quarter");
    const isLine = res2.visualization?.type === "line" || res2.primary_chart_type === "line";
    assert(2, isLine, "Quarterly revenue time series dynamically selected Line chart.");
  } catch (e: any) {
    assert(2, false, `Error in TEST 2: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 3: User: "Compare revenue by region."
  // Expected: Bar chart
  // -------------------------------------------------------------
  try {
    const res3 = await runAdvancedMetricMindAgent("Compare revenue by region");
    const isBar = res3.visualization?.type === "bar" || res3.primary_chart_type === "bar";
    assert(3, isBar, "Regional category comparison dynamically selected Bar chart.");
  } catch (e: any) {
    assert(3, false, `Error in TEST 3: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 4: User: "Show every transaction for the last 20 years."
  // Expected: Query blocked or constrained by cost governance. Cube API NOT CALLED.
  // -------------------------------------------------------------
  try {
    const res4 = await runAdvancedMetricMindAgent("Show every transaction for the last 20 years");
    const isBlocked = res4.status === "blocked";
    const isCostGovernance = res4.governance?.cost_limit === "blocked";
    const notCalled = res4.evidence.rows.some((r) => r.includes("NOT CALLED"));
    assert(
      4,
      isBlocked && isCostGovernance && notCalled,
      "Unbounded query blocked by cost governance before hitting Cube API (Cube API NOT CALLED)."
    );
  } catch (e: any) {
    assert(4, false, `Error in TEST 4: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 5: Repeat same query.
  // Expected: Cache may be used.
  // -------------------------------------------------------------
  try {
    // Run first time to seed cache
    await runAdvancedMetricMindAgent("Show Q3 Revenue");
    // Run second time
    const res5 = await runAdvancedMetricMindAgent("Show Q3 Revenue");
    const cacheFlag = res5.cached === true || res5.governance?.cache_hit === true;
    assert(5, cacheFlag, "Repeated query retrieved from normalized query cache with zero redundant computation.");
  } catch (e: any) {
    assert(5, false, `Error in TEST 5: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 6: Click View API Call.
  // Expected: Exact sanitized Cube API payload displayed.
  // -------------------------------------------------------------
  try {
    const res6 = await runAdvancedMetricMindAgent("Show revenue by quarter");
    const hasEndpoint = res6.api_call?.endpoint === "POST /cubejs-api/v1/load";
    const hasPayload = Boolean(res6.api_call?.payload?.query);
    const isSanitized = res6.api_call?.sanitized === true;
    assert(6, hasEndpoint && hasPayload && isSanitized, "Exact sanitized Cube REST API payload displayed without credentials.");
  } catch (e: any) {
    assert(6, false, `Error in TEST 6: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 7: Click View SQL.
  // Expected: Show SQL only if actually available from semantic layer. Never fabricate SQL.
  // -------------------------------------------------------------
  try {
    const res7 = await runAdvancedMetricMindAgent("Why did European margins drop last quarter?");
    const honestSql = res7.sql_info?.sql_generated_by_llm === "NONE";
    const sourceIsCube = res7.sql_info?.source === "Cube Semantic Layer";
    const honestNotice = !res7.sql_info?.available
      ? res7.sql_info?.message?.includes("SQL preview is unavailable")
      : true;
    assert(7, honestSql && sourceIsCube && Boolean(honestNotice), "Strict transparent SQL handling: zero fabricated AI SQL.");
  } catch (e: any) {
    assert(7, false, `Error in TEST 7: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 8: Unknown metric.
  // Expected: Hallucination Firewall blocks it.
  // -------------------------------------------------------------
  try {
    const res8 = await runAdvancedMetricMindAgent("What is our employee happiness score?");
    const isBlocked = res8.status === "blocked";
    const isFirewall = res8.governance?.firewall === "blocked";
    assert(8, isBlocked && isFirewall, "Hallucination Firewall blocked unapproved metric before touching Cube API.");
  } catch (e: any) {
    assert(8, false, `Error in TEST 8: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 9: Secondary driver metric doesn't exist.
  // Expected: No hallucinated driver. Explains detailed driver analysis is unavailable.
  // -------------------------------------------------------------
  try {
    const res9 = await runAdvancedMetricMindAgent("Why did European margins drop last quarter?", "Executive", {
      forceMissingSecondaryDrivers: true
    });
    const noDrivers = res9.drivers.length === 0;
    const hasExplanation = res9.executive_summary.includes(
      "Detailed driver analysis is unavailable because the required governed cost metrics are not present in the Semantic Layer."
    );
    assert(9, noDrivers && hasExplanation, "Zero hallucinated drivers when metrics do not exist in semantic schema.");
  } catch (e: any) {
    assert(9, false, `Error in TEST 9: ${e.message}`);
  }

  // -------------------------------------------------------------
  // TEST 10: Agent attempts more than 5 queries.
  // Expected: Agent stops. Status: QUERY BUDGET EXCEEDED.
  // -------------------------------------------------------------
  try {
    const tracker = new QueryBudgetTracker(5);
    tracker.recordQuery();
    tracker.recordQuery();
    tracker.recordQuery();
    tracker.recordQuery();
    tracker.recordQuery(); // 5 / 5 reached
    let stopped = false;
    try {
      tracker.recordQuery(); // 6th attempt
    } catch (budgetErr: any) {
      stopped = budgetErr.message.includes("QUERY BUDGET EXCEEDED");
    }
    assert(10, stopped, "Circuit breaker enforces MAX_QUERIES_PER_REQUEST = 5 limit and halts runaway execution.");
  } catch (e: any) {
    assert(10, false, `Error in TEST 10: ${e.message}`);
  }

  console.log("\n=================================================");
  console.log(`SUMMARY: ${passed}/10 Tests Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
