-- ==============================================================================
-- METRICMIND — AGENTIC SEMANTIC BI ENGINE
-- PostgreSQL Production Database Schema
-- ==============================================================================

-- Drop view and tables in reverse dependency order if needed
DROP VIEW IF EXISTS semantic_sales CASCADE;
DROP TABLE IF EXISTS query_audit_logs CASCADE;
DROP TABLE IF EXISTS metric_definitions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

-- ------------------------------------------------------------------------------
-- A. regions
-- ------------------------------------------------------------------------------
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(100) NOT NULL,
    continent VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------------------------
-- B. customers
-- ------------------------------------------------------------------------------
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    region_id INT REFERENCES regions(region_id) ON DELETE RESTRICT,
    customer_segment VARCHAR(50) NOT NULL,
    created_at DATE NOT NULL
);

-- ------------------------------------------------------------------------------
-- C. products
-- ------------------------------------------------------------------------------
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    unit_price NUMERIC(12,2) NOT NULL
);

-- ------------------------------------------------------------------------------
-- D. orders
-- ------------------------------------------------------------------------------
CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    customer_id INT REFERENCES customers(customer_id) ON DELETE RESTRICT,
    region_id INT REFERENCES regions(region_id) ON DELETE RESTRICT,
    order_status VARCHAR(30) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD'
);

-- ------------------------------------------------------------------------------
-- E. order_items
-- ------------------------------------------------------------------------------
CREATE TABLE order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    unit_cost NUMERIC(12,2) NOT NULL CHECK (unit_cost >= 0),
    discount NUMERIC(5,2) DEFAULT 0 CHECK (discount >= 0 AND discount <= 100)
);

-- ------------------------------------------------------------------------------
-- F. metric_definitions (The Governed Semantic Catalog)
-- ------------------------------------------------------------------------------
CREATE TABLE metric_definitions (
    metric_id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    formula_sql TEXT NOT NULL,
    allowed_dimensions TEXT[] NOT NULL,
    owner_team VARCHAR(100) NOT NULL,
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- G. query_audit_logs (AI Semantic Execution and Governance Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE query_audit_logs (
    id SERIAL PRIMARY KEY,
    user_question TEXT NOT NULL,
    generated_sql TEXT NOT NULL,
    metric_used VARCHAR(100),
    dimensions_used TEXT[],
    execution_status VARCHAR(50) NOT NULL,
    execution_time_ms NUMERIC(10,2) NOT NULL,
    row_count INT DEFAULT 0,
    ai_confidence NUMERIC(5,2) DEFAULT 1.00,
    validation_result VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- H. Governed View: semantic_sales
-- Only include completed orders in this governed analytical view.
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Indexes for Analytical Performance
-- ------------------------------------------------------------------------------
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_region_id ON orders(region_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_audit_created_at ON query_audit_logs(created_at DESC);
