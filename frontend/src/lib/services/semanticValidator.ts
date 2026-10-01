import {
  APPROVED_MEASURES,
  APPROVED_DIMENSIONS,
  GovernedMeasure,
  SemanticQueryPayload,
  SemanticQueryPayloadSchema
} from "../semanticSchema";

export interface SemanticValidationResult {
  valid: boolean;
  errors: string[];
  measures: GovernedMeasure[];
  dimensions: string[];
}

export interface DriverMetricsAvailability {
  available: boolean;
  presentDrivers: string[];
  missingDrivers: string[];
  message?: string;
}

/**
 * Validates a semantic query payload against the governed catalog.
 */
export function validateSemanticQuery(payload: SemanticQueryPayload): SemanticValidationResult {
  const zodResult = SemanticQueryPayloadSchema.safeParse(payload);
  const errors: string[] = [];
  const foundMeasures: GovernedMeasure[] = [];
  const validDimensions: string[] = [];

  if (!zodResult.success) {
    zodResult.error.issues.forEach((issue) => {
      errors.push(`Field '${issue.path.join(".")}': ${issue.message}`);
    });
    return { valid: false, errors, measures: [], dimensions: [] };
  }

  // Check measures exist in approved schema
  for (const mName of payload.measures) {
    const cleanName = mName.replace(/^(Sales|Expenses|Date)\./, "");
    const found = APPROVED_MEASURES.find(
      (m) => m.name === cleanName || m.technical_name === mName
    );
    if (!found) {
      errors.push(`Ungoverned measure: '${mName}'. Only metrics cataloged in the Semantic Layer are allowed.`);
    } else {
      foundMeasures.push(found);
    }
  }

  // Check dimensions exist in approved schema
  for (const dName of payload.dimensions) {
    const cleanName = dName.replace(/^(Geography|Sales|Customers|Date)\./, "");
    const found = APPROVED_DIMENSIONS.find(
      (d) => d.name === cleanName || `${d.cube}.${d.name}` === dName
    );
    if (!found) {
      errors.push(`Ungoverned dimension: '${dName}'. Only dimensions defined in the Semantic Layer are allowed.`);
    } else {
      validDimensions.push(cleanName);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    measures: foundMeasures,
    dimensions: validDimensions
  };
}

/**
 * Checks whether specific candidate driver metrics exist in the Semantic Layer.
 * Strictly prevents inventing or hallucinating metrics (e.g. shipping_cost vs logistics_cost).
 */
export function checkSecondaryDriversInSchema(
  candidateDrivers: string[]
): DriverMetricsAvailability {
  const present: string[] = [];
  const missing: string[] = [];

  for (const candidate of candidateDrivers) {
    const clean = candidate.replace(/^(Sales|Expenses)\./, "").toLowerCase();
    const exists = APPROVED_MEASURES.some((m) => m.name.toLowerCase() === clean);
    if (exists) {
      present.push(clean);
    } else {
      missing.push(clean);
    }
  }

  const available = present.length > 0;
  return {
    available,
    presentDrivers: present,
    missingDrivers: missing,
    message: available
      ? undefined
      : "Detailed driver analysis is unavailable because the required governed cost metrics are not present in the Semantic Layer."
  };
}
