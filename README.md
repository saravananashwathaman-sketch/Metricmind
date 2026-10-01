# METRICMIND — Agentic Semantic BI Engine with Cube.dev

> **"Ask business questions. Get governed answers."**  
> *The AI agent reasons over governed business metrics in Cube.dev instead of generating raw SQL.*

---

## 1. What is Cube.dev?

[Cube.dev](https://cube.dev/) is an open-source universal semantic layer designed for enterprise data applications and BI engines. It provides:
1. **Centralized Metric Governance**: Single source of truth for business calculations (Revenue, Gross Margin, Total Orders, Average Order Value).
2. **Schema & Multi-Dimensional Modeling**: Declarative YAML data models (`Sales.yml`, `Orders.yml`, `Geography.yml`, `Date.yml`, `Customers.yml`).
3. **High-Performance Query Engine**: Converts structured JSON queries (`POST /cubejs-api/v1/load`) into optimized SQL executed against the underlying data warehouse (PostgreSQL / Snowflake).
4. **Access Control & Security**: Restricts access, governs dimensions, and prevents rogue data queries.

---

## 2. Why MetricMind Uses Cube as the Semantic Layer

Traditional AI business intelligence systems rely on direct **Text-to-SQL**, where an LLM translates a user question into arbitrary SQL queries executed directly against a database. In enterprise finance and operations, this leads to:
- **Metric Drift & Hallucinations**: Multiple queries calculate "Gross Margin" with different formulas, leading to conflicting answers across departments.
- **Security Hazards**: The LLM could access unauthorized tables, expose sensitive customer PII, or execute expensive unbounded full-table scans.
- **Unverifiable Explanations**: Business executives cannot verify whether an answer reflects standard corporate accounting practices.

### The MetricMind Solution:
**MetricMind shifts the architecture entirely:**
```
❌ OLD PATTERN: User Question → LLM → Raw SQL → Database
✅ METRICMIND:  User Question → Agentic Orchestrator → Governed Metric Selection → Cube Query JSON → AI Hallucination Firewall → Cube REST API → PostgreSQL → Verified Result → AI Explanation
```

The LLM is **never allowed to generate unrestricted SQL**. Cube serves as the governed boundary between the AI agent and PostgreSQL.

---

## 3. System Architecture

```mermaid
flowchart TD
    User([User / Executive]) --> Chat[Ask MetricMind Chat UI]
    Chat --> Orchestrator[Agentic Orchestrator]
    
    subgraph GovernanceGateway [Governance Gateway]
        Orchestrator --> Intent[Intent Detection & Parameter Extraction]
        Intent --> MetricMap[Governed Metric & Dimension Resolution]
        MetricMap --> CubeQueryBuilder[Cube Query Builder JSON]
        CubeQueryBuilder --> Firewall{🛡️ AI Hallucination Firewall}
        Firewall -- Unknown Metric --> Blocked[Query Blocked: Not Governed]
        Firewall -- Valid Query --> CostCheck{💰 Cost Governance}
        CostCheck -- Unbounded Range --> BlockedCost[Query Blocked: Exceeds Limits]
    end

    subgraph SemanticLayer [Cube.dev Semantic Layer]
        CostCheck -- Approved --> CubeClient[Cube REST Client]
        CubeClient --> CubeREST[POST /cubejs-api/v1/load]
        CubeREST --> CubeModels[Cube Models: Sales.yml, Orders.yml, Geography.yml]
    end

    subgraph Warehouse [PostgreSQL Warehouse]
        CubeModels --> Postgres[(PostgreSQL semantic_sales)]
        Postgres --> Result[Structured Normalized Result]
    end

    subgraph ExplanationEngine [AI Analytical Explanation]
        Result --> Analysis[Driver & Variance Analysis Engine]
        Analysis --> VizEngine[Dynamic Visualization Engine]
        VizEngine --> ExecutiveCard[Executive Response Card]
        ExecutiveCard --> Transparency[View API Call / View SQL Panel]
    end

    ExecutiveCard --> User
```

---

## 4. Governed Semantic Metrics & Dimensions

### Approved Measures
| Semantic Measure | Cube Identifier | Formula / Aggregation | Description |
| :--- | :--- | :--- | :--- |
| **Revenue** | `Sales.revenue` | `SUM(revenue)` | Total recognized sales revenue across completed commercial transactions |
| **Cost (COGS)** | `Sales.cost` | `SUM(cost)` | Direct product, shipping, and delivery expenses |
| **Gross Profit** | `Sales.gross_profit` | `Revenue - Cost` | Operational earnings after deducting direct COGS |
| **Gross Margin %** | `Sales.gross_margin` | `((Revenue - Cost) / Revenue) * 100` | Operational profitability efficiency percentage |
| **Total Orders** | `Sales.order_count` | `COUNT(DISTINCT order_id)` | Total count of fulfilled sales orders |
| **Average Order Value (AOV)** | `Sales.average_order_value` | `Revenue / Total Orders` | Average transaction basket size |
| **Customer Count** | `Customers.customer_count` | `COUNT(DISTINCT customer_id)` | Unique enterprise customers served |
| **Logistics Cost** | `Sales.logistics_cost` | `SUM(logistics_cost)` | Freight and supply-chain logistics surcharge |
| **Material Cost** | `Sales.material_cost` | `SUM(material_cost)` | Direct bill of materials and fabrication cost |
| **Operating Cost** | `Sales.operating_cost` | `SUM(operating_cost)` | Operating fulfillment expenses |

### Approved Dimensions
| Dimension | Cube Identifier | Description |
| :--- | :--- | :--- |
| **Region** | `Geography.region` | Operating theater (Europe, North America, India, APAC) |
| **Country** | `Geography.country` | Sovereign jurisdiction / nation |
| **Customer** | `Customers.customer_name` | Enterprise customer corporate name |
| **Customer Segment** | `Customers.customer_segment` | Enterprise, Mid-Market, SMB |
| **Product** | `Sales.product` | Software / hardware product line |
| **Category** | `Sales.product_category` | High-level portfolio category |
| **Order Date** | `Date.date` | Transaction calendar date |
| **Quarter / Month** | `Date.quarter`, `Date.month` | Standard fiscal and calendar temporal dimensions |

---

## 5. AI Hallucination Firewall

Before any query is transmitted to Cube or PostgreSQL, it must pass through the **AI Hallucination Firewall** (`src/lib/cube/cubeValidator.ts`).

- **Measure Verification**: Checks measures against `ALLOWED_MEASURES`.
- **Dimension Verification**: Checks dimensions against `ALLOWED_DIMENSIONS`.
- **Operator Verification**: Validates allowed filter operators.
- **Rogue Query Interception**: If the AI attempts to invent a metric (e.g., `"customer_profitability_score"` or `"employee happiness score"`):
  - **The query is immediately blocked.**
  - **Cube API is NOT CALLED.**
  - Returns a clean error:
    ```
    "Metric 'customer_profitability_score' is not available in the governed semantic layer."
    ```

---

## 6. Environment Variables

Create `.env.local` inside the `frontend` folder:

```bash
# Semantic Layer Mode: "mock" (default, deterministic development adapter) or "cube" (live Cube.dev REST server)
SEMANTIC_LAYER_MODE="mock"
NEXT_PUBLIC_SEMANTIC_LAYER_MODE="mock"

# Cube.dev Live REST API Credentials (Server-side ONLY. Never expose with NEXT_PUBLIC_)
CUBE_API_URL="http://localhost:4000"
CUBE_API_TOKEN="your_cube_jwt_secret_token"
CUBEJS_API_URL="http://localhost:4000"
CUBEJS_API_SECRET="your_cube_jwt_secret_token"

# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/metricmind"

# Cost Governance Limits (Configurable)
MAX_AGENT_STEPS=5
MAX_QUERIES_PER_REQUEST=5
MAX_RESULT_ROWS=1000
MAX_DIMENSIONS=5
MAX_MEASURES=10
MAX_FILTERS=10
MAX_QUERY_TIMEOUT_MS=10000
```

---

## 7. API Flow & Endpoints

### Primary Semantic Query Route: `POST /api/metricmind/query`

**Request:**
```json
{
  "question": "Show Q3 revenue by region"
}
```

**Flow:**
1. Receives question.
2. Sends question to Agentic Orchestrator.
3. Generates structured Cube Query JSON (`{"measures": ["Sales.revenue"], "dimensions": ["Geography.region"]}`).
4. Validates query through AI Hallucination Firewall.
5. Sends query to Cube REST API (`POST /cubejs-api/v1/load`).
6. Receives structured result set.
7. Generates evidence-backed, non-causal AI explanation.
8. Records governance audit entry.
9. Returns structured response.

**Response:**
```json
{
  "question": "Show Q3 revenue by region",
  "intent": "Revenue Analysis",
  "metric": "Revenue",
  "dimensions": ["region"],
  "timeRange": "Q3 2026",
  "semanticQuery": {
    "measures": ["Sales.revenue"],
    "dimensions": ["Geography.region"],
    "limit": 100
  },
  "validation": {
    "valid": true,
    "firewall": "passed",
    "governed_signature": "CUBE-LIVE-ABC123"
  },
  "source": "Cube.dev Live REST API",
  "data": [
    { "Geography.region": "Europe", "Sales.revenue": 158000000 },
    { "Geography.region": "North America", "Sales.revenue": 142000000 },
    { "Geography.region": "India", "Sales.revenue": 124200000 },
    { "Geography.region": "APAC", "Sales.revenue": 62000000 }
  ],
  "explanation": "Regional distribution for Revenue shows Europe leading with ₹15.80 Cr...",
  "governance": {
    "firewall": "passed",
    "semantic_validation": "passed",
    "status": "APPROVED"
  }
}
```

---

## 8. How to Run the Project

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22)
- npm or pnpm
- (Optional) PostgreSQL 15+ and Cube.dev CLI (`npm install -g cubejs-cli`)

### Quick Start (Development / Mock Mode)
MetricMind includes a deterministic, production-grade development adapter so you can run and test the complete system with zero database dependencies:

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Run the Next.js development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Running with a Live Cube Server
If you have Cube deployed or want to run Cube locally:

```bash
# 1. Set up PostgreSQL
psql -U postgres -d metricmind -f database/schema.sql
psql -U postgres -d metricmind -f database/seed.sql

# 2. Start the Cube.dev server
cd cube
npm install
npm run dev # Starts Cube on port 4000

# 3. Configure frontend to use live Cube
# In frontend/.env.local:
SEMANTIC_LAYER_MODE="cube"
CUBE_API_URL="http://localhost:4000"
CUBE_API_TOKEN="your_jwt_token"
```

---

## 9. Google Authentication Setup

MetricMind supports enterprise Google Gmail / Google OAuth 2.0 single sign-on alongside traditional email/password and demo mode.

### 1. Google Cloud Console Configuration
1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or select your project (`MetricMind`).
2. Configure the **OAuth consent screen** (App Name: `MetricMind`, Scopes: `email`, `profile`, `openid`).
3. Under **Credentials** → **Create Credentials** → **OAuth Client ID** (Web application).
4. Add the following URIs:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URI**: `http://localhost:3000/api/auth/google/callback`

### 2. Configure Local Environment
Add your credentials to `frontend/.env.local`:
```env
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For complete instructions and production deployment guidelines, see [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md).

---

## 10. Testing & Verification

MetricMind provides two automated test suites covering all acceptance requirements:

### 1. Cube Semantic Layer Integration Tests
Tests all 8 demo queries from Section 14 and verifies that unapproved metrics are blocked:
```bash
cd frontend
npx tsx src/lib/cube/__tests__/runCubeIntegrationTests.ts
```
Expected output: **9/9 Tests Passed, 0 Failed.**

### 2. Multi-Step Reasoning & Governance Tests
Tests multi-step analysis, ECharts dynamic visual selection, query budget limits, and cache hits:
```bash
cd frontend
npx tsx src/lib/services/__tests__/runAcceptanceTests.ts
```
Expected output: **10/10 Tests Passed, 0 Failed.**

---

## 11. Demo Queries to Try in the UI

1. `"What is our total revenue?"` → Returns single KPI card (₹48.62 Cr) sourced from `Sales.revenue`.
2. `"Show revenue by region."` → Returns Bar chart with European, North American, Indian, and APAC breakdown.
3. `"Show Q3 revenue."` → Returns Line chart / Quarterly aggregation.
4. `"Compare Q3 revenue with Q2."` → Returns multi-period time-series comparison.
5. `"What is the gross margin?"` → Returns 27.2% with governed formula `((Revenue - Cost) / Revenue) * 100`.
6. `"Show gross margin by region."` → Returns regional margin comparison.
7. `"Why did European margins drop last quarter?"` → Triggers multi-step driver analysis, Waterfall variance bridge, and cost breakdown.
8. `"Which region generated the highest revenue?"` → Returns ranked Europe revenue at ₹15.80 Cr.
9. `"Show employee happiness score."` → Intercepted by the **AI Hallucination Firewall** (Cube API NOT called).
