import { CubeQueryPayload } from "./cubeTypes";
import { normalizeMeasureToCube, normalizeDimensionToCube } from "./cubeClient";

export interface ExtractedSemanticIntent {
  intent: string;
  metric: string;
  metricDisplayName: string;
  dimensions: string[];
  region?: string;
  timeRange?: string;
  isComparison?: boolean;
}

/**
 * Extracts business intent, metrics, dimensions, and filters from a user question.
 * Strictly resolves to approved semantic layer entities.
 */
export function extractSemanticIntent(question: string): ExtractedSemanticIntent {
  const q = question.toLowerCase();

  // 1. Detect metric
  let metric = "Sales.revenue";
  let metricDisplayName = "Revenue";
  let intent = "Revenue Analysis";

  if (q.includes("margin") || q.includes("profitability")) {
    metric = "Sales.gross_margin";
    metricDisplayName = "Gross Margin";
    intent = "Margin Variance Analysis";
  } else if (q.includes("gross profit") || (q.includes("profit") && !q.includes("margin"))) {
    metric = "Sales.gross_profit";
    metricDisplayName = "Gross Profit";
    intent = "Gross Profit Performance";
  } else if (q.includes("cost") || q.includes("cogs") || q.includes("expense")) {
    metric = "Sales.cost";
    metricDisplayName = "Cost of Goods Sold (COGS)";
    intent = "Expense Analysis";
  } else if (q.includes("order") && (q.includes("count") || q.includes("total") || q.includes("volume"))) {
    metric = "Sales.order_count";
    metricDisplayName = "Total Orders";
    intent = "Order Volume Analysis";
  } else if (q.includes("aov") || q.includes("average order")) {
    metric = "Sales.average_order_value";
    metricDisplayName = "Average Order Value";
    intent = "Basket Size Analysis";
  } else if (q.includes("customer count") || q.includes("number of customers")) {
    metric = "Customers.customer_count";
    metricDisplayName = "Customer Count";
    intent = "Customer Base Growth";
  }

  // 2. Detect dimensions
  const dimensions: string[] = [];
  if (q.includes("region") || q.includes("by region") || q.includes("highest revenue") || q.includes("across regions")) {
    dimensions.push("Geography.region");
  }
  if (q.includes("country") || q.includes("by country") || q.includes("germany") || q.includes("france")) {
    dimensions.push("Geography.country");
  }
  if (q.includes("product") && !q.includes("category")) {
    dimensions.push("Sales.product");
  }
  if (q.includes("category") || q.includes("product category")) {
    dimensions.push("Sales.product_category");
  }
  if (q.includes("customer") && !q.includes("count")) {
    dimensions.push("Customers.customer_name");
  }

  // 3. Detect region filter
  let region: string | undefined;
  if (q.includes("europe") || q.includes("european")) {
    region = "Europe";
  } else if (q.includes("north america") || q.includes("us") || q.includes("usa")) {
    region = "North America";
  } else if (q.includes("india")) {
    region = "India";
  } else if (q.includes("apac") || q.includes("asia")) {
    region = "APAC";
  }

  // 4. Detect time context
  let timeRange: string | undefined;
  if (q.includes("q3")) {
    timeRange = "Q3 2026";
  } else if (q.includes("q2")) {
    timeRange = "Q2 2026";
  } else if (q.includes("q1")) {
    timeRange = "Q1 2026";
  } else if (q.includes("last quarter") || q.includes("quarter")) {
    timeRange = "Q2 2026";
  }

  const isComparison = q.includes("compare") || q.includes("with q2") || q.includes("between") || q.includes("vs");

  return {
    intent,
    metric,
    metricDisplayName,
    dimensions,
    region,
    timeRange,
    isComparison
  };
}

/**
 * Builds a structured Cube Query JSON object from a natural language question.
 * Never generates raw SQL.
 */
export function buildCubeQueryFromQuestion(question: string): {
  intent: ExtractedSemanticIntent;
  cubeQuery: CubeQueryPayload;
} {
  const intent = extractSemanticIntent(question);
  const q = question.toLowerCase();

  const cubeQuery: CubeQueryPayload = {
    measures: [intent.metric]
  };

  // Add dimensions
  if (intent.dimensions.length > 0) {
    cubeQuery.dimensions = intent.dimensions;
  }

  // Add time dimensions if quarterly / monthly breakdown is requested
  if (
    q.includes("by quarter") ||
    q.includes("quarterly") ||
    q.includes("trend") ||
    q.includes("over time") ||
    intent.isComparison
  ) {
    cubeQuery.timeDimensions = [
      {
        dimension: "Date.date",
        granularity: "quarter"
      }
    ];
  } else if (intent.timeRange) {
    // Specific quarter filter
    cubeQuery.timeDimensions = [
      {
        dimension: "Date.date",
        granularity: "quarter",
        dateRange: intent.timeRange.includes("Q3")
          ? ["2026-07-01", "2026-09-30"]
          : intent.timeRange.includes("Q2")
          ? ["2026-04-01", "2026-06-30"]
          : ["2026-01-01", "2026-03-31"]
      }
    ];
  }

  // Add filters
  if (intent.region) {
    cubeQuery.filters = [
      {
        member: "Geography.region",
        operator: "equals",
        values: [intent.region]
      }
    ];
  }

  // Add ordering and limits for ranking questions ("highest", "top")
  if (q.includes("highest") || q.includes("top") || q.includes("best")) {
    cubeQuery.order = {
      [intent.metric]: "desc"
    };
    cubeQuery.limit = 5;
  } else {
    cubeQuery.limit = 100;
  }

  return {
    intent,
    cubeQuery
  };
}

/**
 * Common pre-built query helpers
 */
export const CubeQueryLibrary = {
  totalRevenue: (): CubeQueryPayload => ({
    measures: ["Sales.revenue"]
  }),

  revenueByRegion: (): CubeQueryPayload => ({
    measures: ["Sales.revenue"],
    dimensions: ["Geography.region"],
    order: { "Sales.revenue": "desc" }
  }),

  q3Revenue: (): CubeQueryPayload => ({
    measures: ["Sales.revenue"],
    timeDimensions: [
      {
        dimension: "Date.date",
        granularity: "quarter",
        dateRange: ["2026-07-01", "2026-09-30"]
      }
    ]
  }),

  compareQ3WithQ2Revenue: (): CubeQueryPayload => ({
    measures: ["Sales.revenue"],
    timeDimensions: [
      {
        dimension: "Date.date",
        granularity: "quarter",
        dateRange: ["2026-04-01", "2026-09-30"]
      }
    ]
  }),

  grossMargin: (): CubeQueryPayload => ({
    measures: ["Sales.gross_margin"]
  }),

  grossMarginByRegion: (): CubeQueryPayload => ({
    measures: ["Sales.gross_margin"],
    dimensions: ["Geography.region"]
  }),

  europeanRevenueDecline: (): CubeQueryPayload => ({
    measures: ["Sales.revenue", "Sales.cost", "Sales.gross_profit"],
    dimensions: ["Geography.country"],
    filters: [
      {
        member: "Geography.region",
        operator: "equals",
        values: ["Europe"]
      }
    ]
  }),

  highestRevenueRegion: (): CubeQueryPayload => ({
    measures: ["Sales.revenue"],
    dimensions: ["Geography.region"],
    order: { "Sales.revenue": "desc" },
    limit: 1
  })
};
