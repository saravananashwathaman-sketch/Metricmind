import { CubeQueryPayload, CubeValidationResult } from "./cubeTypes";

/**
 * GOVERNED ALLOWLIST FOR CUBE SEMANTIC OBJECTS
 * AI HALLUCINATION FIREWALL
 *
 * The LLM is strictly prohibited from executing queries with metrics or dimensions
 * not explicitly verified and approved in this governed semantic registry.
 */

export const ALLOWED_MEASURES = new Set([
  // Canonical Cube Names
  "Sales.revenue",
  "Sales.cost",
  "Sales.gross_profit",
  "Sales.gross_margin",
  "Sales.order_count",
  "Sales.average_order_value",
  "Sales.logistics_cost",
  "Sales.material_cost",
  "Sales.operating_cost",
  "Orders.order_count",
  "Customers.customer_count",

  // Schema Aliases & Alternate Qualified Names
  "orders.revenue",
  "orders.cost",
  "orders.grossMargin",
  "orders.grossMarginPercent",
  "orders.totalOrders",
  "orders.averageOrderValue",
  "orders.customerCount",
  "orders.order_count",

  // Short Unqualified Governed Measure Names
  "revenue",
  "cost",
  "gross_profit",
  "gross_margin",
  "gross_margin_percent",
  "order_count",
  "total_orders",
  "average_order_value",
  "aov",
  "customer_count",
  "logistics_cost",
  "material_cost",
  "operating_cost"
]);

export const ALLOWED_DIMENSIONS = new Set([
  // Canonical Cube Names
  "Geography.region",
  "Geography.country",
  "Geography.city",
  "Customers.customer_name",
  "Customers.customer_segment",
  "Customers.industry",
  "Sales.product",
  "Sales.product_category",
  "Sales.customer_segment",
  "Orders.order_id",
  "Orders.status",
  "Date.date",
  "Date.month",
  "Date.quarter",
  "Date.year",
  "Date.fiscal_quarter",

  // Schema Aliases & Alternate Qualified Names
  "orders.region",
  "orders.country",
  "orders.customer",
  "orders.product",
  "orders.category",
  "orders.orderDate",
  "orders.order_date",
  "orders.customer_segment",

  // Short Unqualified Governed Dimension Names
  "region",
  "country",
  "city",
  "customer",
  "customer_name",
  "customer_segment",
  "product",
  "product_name",
  "category",
  "product_category",
  "date",
  "order_date",
  "month",
  "quarter",
  "year",
  "order_id",
  "status"
]);

export const ALLOWED_OPERATORS = new Set([
  "equals",
  "notEquals",
  "contains",
  "notContains",
  "gt",
  "gte",
  "lt",
  "lte",
  "set",
  "notSet",
  "inDateRange",
  "beforeDate",
  "afterDate"
]);

/**
 * Validates a Cube query payload against the AI Hallucination Firewall.
 * Intercepts unapproved measures, invented dimensions, or malformed queries
 * before any call is made to Cube or PostgreSQL.
 */
export function validateCubeQuery(query: any): CubeValidationResult {
  if (!query || typeof query !== "object") {
    return {
      valid: false,
      error: "Malformed query structure: Query payload must be a non-null object.",
      firewall_status: "BLOCKED",
      validated_measures: [],
      validated_dimensions: [],
      validated_filters: [],
      violation_stage: "STRUCTURE_VALIDATION"
    };
  }

  // 1. Measures validation
  if (!Array.isArray(query.measures) || query.measures.length === 0) {
    return {
      valid: false,
      error: "Query validation failed: Query must contain at least one governed measure.",
      firewall_status: "BLOCKED",
      validated_measures: [],
      validated_dimensions: [],
      validated_filters: [],
      violation_stage: "MEASURE_FIREWALL"
    };
  }

  for (const measure of query.measures) {
    if (typeof measure !== "string" || !ALLOWED_MEASURES.has(measure.trim())) {
      return {
        valid: false,
        error: `Metric '${measure}' is not available in the governed semantic layer.`,
        firewall_status: "BLOCKED",
        validated_measures: [],
        validated_dimensions: [],
        validated_filters: [],
        violation_stage: "MEASURE_FIREWALL"
      };
    }
  }

  // 2. Dimensions validation
  if (query.dimensions) {
    if (!Array.isArray(query.dimensions)) {
      return {
        valid: false,
        error: "Query validation failed: 'dimensions' must be an array of strings.",
        firewall_status: "BLOCKED",
        validated_measures: query.measures,
        validated_dimensions: [],
        validated_filters: [],
        violation_stage: "DIMENSION_FIREWALL"
      };
    }

    for (const dim of query.dimensions) {
      if (typeof dim !== "string" || !ALLOWED_DIMENSIONS.has(dim.trim())) {
        return {
          valid: false,
          error: `Dimension '${dim}' is not available in the governed semantic layer.`,
          firewall_status: "BLOCKED",
          validated_measures: query.measures,
          validated_dimensions: [],
          validated_filters: [],
          violation_stage: "DIMENSION_FIREWALL"
        };
      }
    }
  }

  // 3. Time dimensions validation
  if (query.timeDimensions) {
    if (!Array.isArray(query.timeDimensions)) {
      return {
        valid: false,
        error: "Query validation failed: 'timeDimensions' must be an array.",
        firewall_status: "BLOCKED",
        validated_measures: query.measures,
        validated_dimensions: query.dimensions || [],
        validated_filters: [],
        violation_stage: "STRUCTURE_VALIDATION"
      };
    }

    for (const td of query.timeDimensions) {
      if (!td || typeof td !== "object" || !td.dimension || !ALLOWED_DIMENSIONS.has(td.dimension)) {
        return {
          valid: false,
          error: `Time dimension '${td?.dimension || "unknown"}' is not governed in the semantic layer.`,
          firewall_status: "BLOCKED",
          validated_measures: query.measures,
          validated_dimensions: query.dimensions || [],
          validated_filters: [],
          violation_stage: "DIMENSION_FIREWALL"
        };
      }
    }
  }

  // 4. Filters validation
  if (query.filters) {
    if (!Array.isArray(query.filters)) {
      return {
        valid: false,
        error: "Query validation failed: 'filters' must be an array.",
        firewall_status: "BLOCKED",
        validated_measures: query.measures,
        validated_dimensions: query.dimensions || [],
        validated_filters: [],
        violation_stage: "STRUCTURE_VALIDATION"
      };
    }

    for (const f of query.filters) {
      if (!f || typeof f !== "object" || !f.member) {
        return {
          valid: false,
          error: "Filter validation failed: Filter entry missing 'member'.",
          firewall_status: "BLOCKED",
          validated_measures: query.measures,
          validated_dimensions: query.dimensions || [],
          validated_filters: [],
          violation_stage: "OPERATOR_FIREWALL"
        };
      }

      const isAllowedMember = ALLOWED_MEASURES.has(f.member) || ALLOWED_DIMENSIONS.has(f.member);
      if (!isAllowedMember) {
        return {
          valid: false,
          error: `Filter member '${f.member}' is not part of the governed semantic model.`,
          firewall_status: "BLOCKED",
          validated_measures: query.measures,
          validated_dimensions: query.dimensions || [],
          validated_filters: [],
          violation_stage: "OPERATOR_FIREWALL"
        };
      }

      if (f.operator && !ALLOWED_OPERATORS.has(f.operator)) {
        return {
          valid: false,
          error: `Filter operator '${f.operator}' is not supported by the semantic engine.`,
          firewall_status: "BLOCKED",
          validated_measures: query.measures,
          validated_dimensions: query.dimensions || [],
          validated_filters: [],
          violation_stage: "OPERATOR_FIREWALL"
        };
      }
    }
  }

  // All checks passed
  return {
    valid: true,
    firewall_status: "PASSED",
    validated_measures: query.measures,
    validated_dimensions: query.dimensions || [],
    validated_filters: (query.filters || []).map((f: any) => `${f.member} ${f.operator} ${f.values?.join(",")}`)
  };
}
