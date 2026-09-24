# MetricMind — PostgreSQL Database Layer

This directory contains the production-grade PostgreSQL database schema, seed datasets, and semantic views for the **MetricMind Agentic Semantic BI Engine**.

---

## 1. Files in this Directory

- `schema.sql`: Complete DDL for tables (`regions`, `customers`, `products`, `orders`, `order_items`, `metric_definitions`, `query_audit_logs`), the governed `semantic_sales` view, foreign keys, constraints, and analytical B-Tree indexes.
- `seed.sql`: Realistic corporate enterprise dataset with 7 global regions, enterprise customer accounts, 6 product suites, multi-quarter transactions across Q3 2025 – Q2 2026, governed metric definitions, and audit logs.
- `README.md`: Setup, connection instructions, and governance guidelines.

---

## 2. Quick Setup with PostgreSQL

### Step 1: Create the Database
```bash
# Log into your PostgreSQL instance
createdb -U postgres metricmind
# OR in psql:
CREATE DATABASE metricmind;
```

### Step 2: Apply the Schema and Seed Data
```bash
psql -U postgres -d metricmind -f database/schema.sql
psql -U postgres -d metricmind -f database/seed.sql
```

### Step 3: Configure Environment
Set `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/metricmind"
```

---

## 3. The Governed Semantic Layer: `semantic_sales`

MetricMind strictly prohibits the LLM from generating arbitrary joins against raw transactional tables. Instead, all natural language analytics queries run through the governed `semantic_sales` view:

```sql
CREATE OR REPLACE VIEW semantic_sales AS
SELECT 
    o.order_id,
    o.order_date,
    r.region_name,
    r.country,
    r.continent,
    c.customer_name,
    c.customer_segment,
    p.product_name,
    p.category,
    p.subcategory,
    oi.quantity,
    oi.unit_price,
    oi.unit_cost,
    oi.discount,
    ROUND((oi.quantity * oi.unit_price * (1.0 - (oi.discount / 100.0))), 2) AS revenue,
    ROUND((oi.quantity * oi.unit_cost), 2) AS cost,
    ROUND(((oi.quantity * oi.unit_price * (1.0 - (oi.discount / 100.0))) - (oi.quantity * oi.unit_cost)), 2) AS gross_profit
FROM orders o
JOIN regions r ON o.region_id = r.region_id
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_status = 'Completed';
```

---

## 4. Governed Metric Formulas

All metrics are stored in `metric_definitions` and strictly enforced:

| Metric | Formula | Description |
|---|---|---|
| **Revenue** | `SUM(quantity * unit_price * (1 - discount/100))` | Top-line completed billings |
| **Cost** | `SUM(quantity * unit_cost)` | Direct COGS & fulfillment |
| **Gross Profit** | `Revenue - Cost` | Net gross earnings |
| **Margin** | `((Revenue - Cost) / Revenue) * 100` | Governed gross margin percentage |
| **Orders** | `COUNT(DISTINCT order_id)` | Total unique completed orders |

---

## 5. Security & Read-Only Governance

The MetricMind SQL Governance Gateway enforces:
- **Read-Only Enforced**: Only `SELECT` statements are executed. Any `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, or `GRANT` is intercepted and blocked before touching the database.
- **Auditing**: Every executed or blocked query is written to `query_audit_logs`.
