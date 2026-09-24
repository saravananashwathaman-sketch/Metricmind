# METRICMIND — Agentic Semantic BI Engine

> **"Ask business questions. Get governed answers."**  
> *AI reasons over governed business semantics instead of inventing business logic.*

---

## 1. Executive Summary & Problem Statement

### The Problem with Traditional Text-to-SQL
Traditional AI chatbots for BI rely on direct **Text-to-SQL**, where an LLM generates raw SQL queries against production database tables. In enterprise finance and operations, this pattern causes severe issues:
1. **Metric Drift & Hallucinations**: Different queries compute "Gross Margin", "Churn", or "Revenue" with inconsistent math.
2. **Security & Governance Vulnerabilities**: Un-governed LLMs can query unauthorized tables, leak PII, or execute rogue queries.
3. **Lack of Explainability**: Business executives cannot verify whether an answer follows corporate accounting standards.

### The MetricMind Solution
**MetricMind** replaces Text-to-SQL with an **Agentic Semantic BI Architecture**:
- The LLM **never** generates arbitrary SQL against raw database tables.
- All analytical reasoning operates over **governed semantic metrics and dimensions** (Cube.dev / dbt Semantic Layer).
- Every response provides complete **explainability, mathematical formulas, dimensional drivers, cryptographic audit signatures, and end-to-end data lineage**.

```
User Question
      ↓
Conversational BI Interface (Ask MetricMind)
      ↓
AI Agent / Agentic Orchestrator (12-Step Governance Workflow)
      ↓
Metric & Dimension Identification
      ↓
Semantic Layer (Cube.dev / dbt Semantic Layer)
      ↓
Governed Metric Definitions (Single Source of Truth)
      ↓
Semantic Query Execution
      ↓
Enterprise Data Warehouse (Snowflake / Lakehouse)
      ↓
Analytical Reasoning Engine (Variance & Driver Decomposition)
      ↓
Interactive Charts (ECharts Waterfall/Bar) + Executive Explanation + Evidence
```

---

## 2. Key Architecture & Features

### 🌟 1. "Ask MetricMind" Conversational BI
- Natural-language business question interface with real-time **12-Step Agentic Reasoning Progress UI**.
- Resolves intent, maps entities to approved catalog metrics, retrieves data through the semantic layer, and synthesizes executive driver narratives.
- Automatically selects the optimal visualization (Driver Waterfall, Comparison Bar, Multi-quarter Trend line).

### 🏛️ 2. Governed Semantic Catalog
- 9 verified enterprise metrics: **Gross Revenue, Cost of Goods Sold (COGS), Gross Profit, Gross Margin %, Net Profit, Customer Churn Rate, Order Count, Average Order Value (AOV), and Customer Lifetime Value (CLV)**.
- Full mathematical formula transparency, dbt source models, dimensional grain, and owner verification workflows.
- Currency formatted exclusively in **INR (₹, Cr, Lakhs)**.

### 🛡️ 3. Zero Rogue SQL Blocker & Governance Gateway
- **Zero Direct SQL Policy**: Strict architectural separation preventing LLMs from executing raw SQL.
- **Interactive Rogue SQL Simulator**: Test arbitrary SQL injection or un-governed queries and observe real-time interception, risk scoring, and semantic remediation.
- Enterprise Role-Based Access Control (**Admin, Executive, Finance Analyst, Sales Analyst**) with dimensional data masking and real-time audit logging.

### 🔗 4. End-to-End Data Lineage DAG
- Interactive DAG mapping:
  `User Question → Governed Metric → Semantic Definition → dbt Mart → Fact/Dimension Tables → Snowflake Warehouse`
- Inspectable layer parameters, freshness monitors, and compliance assertions.

### 📊 5. Executive Overview & Analytics Studio
- 6 KPI cards with sparklines, period-over-period delta indicators, and subtext context.
- Margin variance waterfall decomposition bridges.
- Multi-theater revenue and margin historical trends.
- Saved Insights knowledge repository and chronological Query History audit logs.

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS design tokens, Glassmorphism
- **Visualizations**: Apache ECharts (`echarts-for-react`)
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS Micro-interactions

### Backend
- **Framework**: Python FastAPI
- **Data & Warehouse**: SQLite Analytical Warehouse (seeded with realistic corporate ERP/CRM datasets in INR currency; architected for seamless Snowflake plug-in)
- **Semantic Layer**: Semantic Query Engine & Catalog (Cube.dev / dbt Semantic Layer specification)
- **AI Orchestration**: 12-Step Agentic Semantic BI Orchestrator with Deterministic Statistical Driver Decomposition

---

## 4. Project Structure

```
MetricMind/
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── orchestrator.py        # 12-step agentic orchestrator
│   │   │   └── reasoning_engine.py    # Variance & root-cause driver decomposition
│   │   ├── api/
│   │   │   ├── chat.py                # Conversational BI endpoint
│   │   │   ├── metrics.py             # Governed Metric Catalog API
│   │   │   ├── analytics.py           # Executive KPIs and trends
│   │   │   ├── lineage.py             # End-to-end DAG data lineage
│   │   │   ├── governance.py          # RBAC & Rogue SQL Blocker simulator
│   │   │   ├── history.py             # Query history logs
│   │   │   └── insights.py            # Saved insights CRUD
│   │   ├── core/
│   │   │   └── config.py              # Application settings & environment
│   │   ├── data/
│   │   │   ├── database.py            # Analytical DB manager & schema
│   │   │   └── mock_data_generator.py # Seed realistic enterprise orders & expenses
│   │   ├── semantic_layer/
│   │   │   ├── catalog.py             # Governed metric definitions & metadata
│   │   │   └── query_engine.py        # Semantic query resolver & runner
│   │   └── main.py                    # FastAPI application entry point
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css            # Dark enterprise theme tokens
│   │   │   ├── layout.tsx             # Root layout & metadata
│   │   │   └── page.tsx               # Primary dashboard & view switcher
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── EChartWrapper.tsx  # Dynamic client-side ECharts renderer
│   │   │   │   ├── WaterfallChart.tsx # Driver waterfall bridge chart
│   │   │   │   ├── TrendLineChart.tsx # Multi-series trend chart
│   │   │   │   ├── ComparisonBarChart.tsx
│   │   │   │   └── Sparkline.tsx      # KPI micro-charts
│   │   │   ├── chat/
│   │   │   │   ├── ChatInterface.tsx  # Conversational BI interface
│   │   │   │   ├── ReasoningProgress.tsx # 12-step agentic progress UI
│   │   │   │   ├── ExecutiveResponseCard.tsx # Structured answers & explainability
│   │   │   │   └── SuggestedPrompts.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx        # Enterprise sidebar navigation
│   │   │   │   ├── TopNav.tsx         # Global filters & role switcher
│   │   │   │   └── CommandPalette.tsx # ⌘K quick search
│   │   │   └── views/
│   │   │       ├── OverviewView.tsx   # Executive overview dashboard
│   │   │       ├── ExecutiveAnalyticsView.tsx # Multi-dimensional analytics
│   │   │       ├── SemanticCatalogView.tsx    # Governed metric catalog
│   │   │       ├── DataLineageView.tsx        # Lineage DAG graph
│   │   │       ├── GovernanceView.tsx # RBAC & Rogue SQL Blocker
│   │   │       ├── SavedInsightsView.tsx
│   │   │       ├── QueryHistoryView.tsx
│   │   │       └── SettingsView.tsx   # Connections & runtime modes
│   │   ├── lib/
│   │   │   ├── api.ts                 # API client with fallback resilience
│   │   │   └── mockData.ts            # Enterprise mock datasets
│   │   └── types/
│   │       └── index.ts               # Complete TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 5. Installation & Running Locally

### Prerequisites
- Node.js (v18+ or v20+)
- Python (v3.10+ or v3.12+)

### 1. Run the Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The backend automatically seeds the analytical warehouse and binds to `http://localhost:8000`.*

### 2. Run the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

## 6. Primary Demo Walkthrough

### Test Scenario: "Why did our European margins drop last quarter?"
1. Open **Ask MetricMind** from the sidebar or click the prompt pill.
2. Observe the **12-Step Agentic Reasoning UI**:
   - Understand intent: Variance Driver Analysis
   - Identify metric: `Gross Margin %` (`((Revenue - Cost) / Revenue) * 100`)
   - Identify filters: `region = 'Europe'`, `period = 'Q2 2026'`
   - Query through semantic layer (Zero Rogue SQL)
   - Perform variance and cost driver statistical decomposition
3. Inspect the **Executive Response Card**:
   - **Summary**: Contraction from 31.4% to 27.2% (-4.2 pp).
   - **Primary Drivers**: Logistics Surge (+38.4%) and Hardware COGS (+24.1%).
   - **Regional Vectors**: Spain contributed largest drag (-1.7 pp), followed by Germany (-1.1 pp), France (-0.8 pp), and Italy (-0.6 pp).
   - **Interactive Chart**: Driver Waterfall Bridge.
   - **Governed Evidence Table**: Cryptographic signature `MM-SIG-GOV-EUR-88A9F`.
   - **Explainability Drawer**: Full formula, dbt source mart, and owner signoff.

### Additional Demo Questions
- *"What was our revenue growth this year?"*
- *"Which region has the highest margin?"*
- *"Which products are driving profit?"*
- *"Compare Europe and Asia."*
- *"Show me our churn trend."*

---

## 7. Zero Rogue SQL Security Guarantee

MetricMind enforces that all AI interactions must resolve against governed semantic metrics. Direct SQL generation from user prompts to warehouse tables is prohibited to prevent metric drift, incorrect aggregations, and security leaks.
