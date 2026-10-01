import { queryCube } from "../cubeClient";
import { validateCubeQuery } from "../cubeValidator";
import { buildCubeQueryFromQuestion, CubeQueryLibrary } from "../cubeQueries";

interface TestCase {
  id: number;
  question: string;
  expectedMetric: string;
  shouldPass: boolean;
  expectedDimensions?: string[];
  expectedFilter?: { member: string; value: string };
}

const DEMO_TESTS: TestCase[] = [
  {
    id: 1,
    question: "What is our total revenue?",
    expectedMetric: "Sales.revenue",
    shouldPass: true
  },
  {
    id: 2,
    question: "Show revenue by region.",
    expectedMetric: "Sales.revenue",
    expectedDimensions: ["Geography.region"],
    shouldPass: true
  },
  {
    id: 3,
    question: "Show Q3 revenue.",
    expectedMetric: "Sales.revenue",
    shouldPass: true
  },
  {
    id: 4,
    question: "Compare Q3 revenue with Q2.",
    expectedMetric: "Sales.revenue",
    shouldPass: true
  },
  {
    id: 5,
    question: "What is the gross margin?",
    expectedMetric: "Sales.gross_margin",
    shouldPass: true
  },
  {
    id: 6,
    question: "Show gross margin by region.",
    expectedMetric: "Sales.gross_margin",
    expectedDimensions: ["Geography.region"],
    shouldPass: true
  },
  {
    id: 7,
    question: "Why did European revenue decrease?",
    expectedMetric: "Sales.revenue",
    expectedFilter: { member: "Geography.region", value: "Europe" },
    shouldPass: true
  },
  {
    id: 8,
    question: "Which region generated the highest revenue?",
    expectedMetric: "Sales.revenue",
    expectedDimensions: ["Geography.region"],
    shouldPass: true
  },
  {
    id: 9,
    question: "Show employee happiness score.",
    expectedMetric: "employee_happiness_score",
    shouldPass: false // Must be intercepted and blocked by AI Hallucination Firewall
  }
];

async function runTests() {
  console.log("=================================================");
  console.log("METRICMIND CUBE SEMANTIC LAYER: VERIFICATION SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  for (const t of DEMO_TESTS) {
    try {
      console.log(`[TEST ${t.id}] Question: "${t.question}"`);

      // 1. Build Cube query from natural language question
      const { intent, cubeQuery } = buildCubeQueryFromQuestion(t.question);

      if (!t.shouldPass) {
        // Deliberately set unapproved measure to verify firewall intercept
        cubeQuery.measures = ["employee_happiness_score"];
      }

      // 2. Validate query with AI Hallucination Firewall
      const validation = validateCubeQuery(cubeQuery);

      if (!t.shouldPass) {
        if (!validation.valid && validation.firewall_status === "BLOCKED") {
          console.log(`  ✓ PASSED: Hallucination Firewall successfully BLOCKED unapproved metric "${cubeQuery.measures[0]}"`);
          console.log(`    Firewall Error: "${validation.error}"`);
          console.log(`    Cube REST API: NOT CALLED\n`);
          passed++;
          continue;
        } else {
          console.error(`  ✗ FAILED: Expected query to be blocked by firewall, but validation succeeded!\n`);
          failed++;
          continue;
        }
      }

      if (!validation.valid) {
        console.error(`  ✗ FAILED: Query validation failed unexpectedly: ${validation.error}\n`);
        failed++;
        continue;
      }

      // 3. Execute via Cube Client
      const result = await queryCube(cubeQuery);

      if (!result.success) {
        console.error(`  ✗ FAILED: Cube execution failed: ${result.error}\n`);
        failed++;
        continue;
      }

      // 4. Verify assertions
      const hasMetric = cubeQuery.measures.some((m) => m === t.expectedMetric || m.includes(t.expectedMetric));
      if (!hasMetric) {
        console.error(`  ✗ FAILED: Expected measure ${t.expectedMetric}, but got: ${cubeQuery.measures.join(", ")}\n`);
        failed++;
        continue;
      }

      if (t.expectedDimensions) {
        const hasDim = t.expectedDimensions.every((ed) =>
          cubeQuery.dimensions?.some((d) => d === ed || d.includes(ed))
        );
        if (!hasDim) {
          console.error(`  ✗ FAILED: Missing expected dimensions: ${t.expectedDimensions.join(", ")}\n`);
          failed++;
          continue;
        }
      }

      if (t.expectedFilter) {
        const hasFilter = cubeQuery.filters?.some(
          (f) => f.member.includes(t.expectedFilter!.member) && f.values.includes(t.expectedFilter!.value)
        );
        if (!hasFilter) {
          console.error(`  ✗ FAILED: Missing expected filter: ${JSON.stringify(t.expectedFilter)}\n`);
          failed++;
          continue;
        }
      }

      console.log(`  ✓ PASSED: Measure=${cubeQuery.measures[0]}, Rows=${result.data.length}, Source=${result.metadata.source}`);
      console.log(`    Generated Cube Query: ${JSON.stringify(cubeQuery)}`);
      console.log(`    Sample Result: ${JSON.stringify(result.data[0])}\n`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ FAILED with error: ${err.message}\n`);
      failed++;
    }
  }

  console.log("=================================================");
  console.log(`SUMMARY: ${passed}/${DEMO_TESTS.length} Tests Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
