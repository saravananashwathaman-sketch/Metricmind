import sqlite3
import pandas as pd
from datetime import datetime
from app.data.mock_data_generator import generate_mock_corporate_data
from typing import Dict, Any, List, Optional
import json

class WarehouseDatabase:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(WarehouseDatabase, cls).__new__(cls)
            cls._instance._initialize_db()
        return cls._instance

    def _initialize_db(self):
        self.conn = sqlite3.connect(":memory:", check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._load_seed_data()
        self._init_app_metadata_tables()

    def _load_seed_data(self):
        datasets = generate_mock_corporate_data()
        for table_name, df in datasets.items():
            # Store in SQLite
            df.to_sql(table_name, self.conn, if_exists="replace", index=False)
            if table_name == "sales":
                df.to_sql("fct_sales", self.conn, if_exists="replace", index=False)
            if table_name == "orders":
                df.to_sql("fct_orders", self.conn, if_exists="replace", index=False)
            if table_name == "expenses":
                df.to_sql("fct_expenses", self.conn, if_exists="replace", index=False)
            if table_name == "customers":
                df.to_sql("dim_customers", self.conn, if_exists="replace", index=False)
            if table_name == "regions":
                df.to_sql("dim_regions", self.conn, if_exists="replace", index=False)
            if table_name == "products":
                df.to_sql("dim_products", self.conn, if_exists="replace", index=False)

    def _init_app_metadata_tables(self):
        cursor = self.conn.cursor()
        
        # Query History
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS query_history (
                id TEXT PRIMARY KEY,
                question TEXT NOT NULL,
                user_role TEXT NOT NULL,
                user_name TEXT NOT NULL,
                metric_id TEXT NOT NULL,
                dimensions TEXT,
                filters TEXT,
                response_summary TEXT,
                execution_time_ms REAL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Saved Insights
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS saved_insights (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                question TEXT NOT NULL,
                metric_id TEXT NOT NULL,
                executive_summary TEXT NOT NULL,
                chart_type TEXT NOT NULL,
                chart_data TEXT,
                drivers TEXT,
                filters TEXT,
                semantic_definition TEXT,
                created_by TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Governance Audit Logs
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS governance_audit_logs (
                id TEXT PRIMARY KEY,
                action TEXT NOT NULL,
                target_type TEXT NOT NULL,
                target_id TEXT NOT NULL,
                performed_by TEXT NOT NULL,
                role TEXT NOT NULL,
                details TEXT,
                compliance_status TEXT DEFAULT 'COMPLIANT',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Seed initial history and saved insights
        self._seed_metadata(cursor)
        self.conn.commit()

    def _seed_metadata(self, cursor):
        initial_history = [
            ("QH_001", "Why did our European margins drop last quarter?", "Executive", "Rajesh Kapoor", "gross_margin", json.dumps(["region", "country"]), json.dumps({"region": "Europe", "period": "Q2 2026 vs Q1 2026"}), "European gross margin declined from 31.4% to 27.2% (-4.2 pp). Logistics and raw materials were the primary drivers.", 342.5, "Completed", "2026-09-24 10:15:00"),
            ("QH_002", "What was our total revenue growth this quarter?", "Finance Analyst", "Meera Iyer", "revenue", json.dumps(["quarter"]), json.dumps({"period": "Q2 2026"}), "Total revenue reached ₹48.6 Cr, a +12.4% quarter-over-quarter expansion.", 215.0, "Completed", "2026-09-24 09:30:00"),
            ("QH_003", "Which region has the highest gross margin?", "Admin", "Priya Sharma", "gross_margin", json.dumps(["region"]), json.dumps({"period": "Q2 2026"}), "India recorded the highest gross margin at 38.2%, followed by North America at 34.1%.", 280.0, "Completed", "2026-09-23 16:45:00"),
            ("QH_004", "Show churn rate trend across customer tiers", "Executive", "Rajesh Kapoor", "churn_rate", json.dumps(["customer_segment"]), json.dumps({"period": "Q2 2026"}), "Overall customer churn rate sits at 4.8%, with Enterprise segment at 1.2%.", 195.0, "Completed", "2026-09-23 11:20:00")
        ]

        for item in initial_history:
            cursor.execute("""
                INSERT OR IGNORE INTO query_history 
                (id, question, user_role, user_name, metric_id, dimensions, filters, response_summary, execution_time_ms, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, item)

        initial_insights = [
            ("INS_001", "European Margin Contraction — Q2 2026 Root Cause", "Why did our European margins drop last quarter?", "gross_margin", "European gross margin declined from 31.4% to 27.2% (-4.2 pp), driven by freight surge in Spain (-1.7 pp) and raw material spikes in Germany (-1.1 pp).", "waterfall", json.dumps([
                {"name": "Q1 Baseline", "value": 31.4, "type": "baseline"},
                {"name": "Spain Freight Spike", "value": -1.7, "type": "negative"},
                {"name": "Germany Raw Material", "value": -1.1, "type": "negative"},
                {"name": "France Distribution", "value": -0.8, "type": "negative"},
                {"name": "Italy Logistics", "value": -0.6, "type": "negative"},
                {"name": "Q2 Margin", "value": 27.2, "type": "final"}
            ]), json.dumps([
                {"driver": "Logistics & Freight", "impact": "-2.1 pp", "change": "+38.4%"},
                {"driver": "Raw Materials", "impact": "-1.4 pp", "change": "+24.1%"},
                {"driver": "Cloud Infrastructure", "impact": "-0.7 pp", "change": "+8.2%"}
            ]), json.dumps({"region": "Europe", "period": "Q2 2026"}), "((Revenue - Cost) / Revenue) * 100", "Rajesh Kapoor", "2026-09-24 10:20:00"),
            
            ("INS_002", "India Expansion & High Profitability Corridor", "Which region has the highest margin?", "gross_margin", "India is delivering highest gross margins company-wide (38.2%) on ₹12.4 Cr revenue, demonstrating strong pricing power in Enterprise SaaS.", "bar", json.dumps([
                {"name": "India", "margin": 38.2, "revenue": 124000000},
                {"name": "North America", "margin": 34.1, "revenue": 142000000},
                {"name": "APAC", "margin": 32.5, "revenue": 62000000},
                {"name": "Europe", "margin": 27.2, "revenue": 158000000}
            ]), json.dumps([
                {"driver": "Enterprise SaaS Mix", "impact": "+4.2 pp", "change": "+28%"},
                {"driver": "Optimized Delivery Cost", "impact": "+2.1 pp", "change": "-12%"}
            ]), json.dumps({"period": "Q2 2026"}), "((Revenue - Cost) / Revenue) * 100", "Priya Sharma", "2026-09-23 17:00:00")
        ]

        for item in initial_insights:
            cursor.execute("""
                INSERT OR IGNORE INTO saved_insights 
                (id, title, question, metric_id, executive_summary, chart_type, chart_data, drivers, filters, semantic_definition, created_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, item)

        audit_logs = [
            ("AUD_001", "METRIC_VERIFIED", "METRIC", "gross_margin", "Priya Sharma", "VP Strategic Finance", "Approved version 3.0.1 calculation standard across EU & APAC entities", "COMPLIANT", "2026-09-18 14:30:00"),
            ("AUD_002", "POLICY_ENFORCED", "QUERY_GATEWAY", "ROGUE_SQL_BLOCK", "SYSTEM_GOVERNOR", "Security Gate", "Blocked direct SELECT * FROM fct_sales; routed through Governed Semantic Layer", "COMPLIANT", "2026-09-24 08:12:00"),
            ("AUD_003", "METRIC_UPDATED", "METRIC", "customer_lifetime_value", "Vikram Malhotra", "Head of CS", "Submitted CLV definition v1.2.0 for audit review", "UNDER_REVIEW", "2026-09-02 11:00:00"),
            ("AUD_004", "ACCESS_GRANTED", "ROLE_RBAC", "Finance Analyst", "Security Admin", "Admin", "Granted Meera Iyer access to fct_income_statement semantic slice", "COMPLIANT", "2026-09-19 09:15:00")
        ]

        for item in audit_logs:
            cursor.execute("""
                INSERT OR IGNORE INTO governance_audit_logs 
                (id, action, target_type, target_id, performed_by, role, details, compliance_status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, item)

    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        cursor = self.conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    def log_query(self, id: str, question: str, role: str, user: str, metric_id: str, dimensions: list, filters: dict, summary: str, exec_ms: float, status: str = "Completed"):
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO query_history (id, question, user_role, user_name, metric_id, dimensions, filters, response_summary, execution_time_ms, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (id, question, role, user, metric_id, json.dumps(dimensions), json.dumps(filters), summary, exec_ms, status))
        self.conn.commit()

    def save_insight(self, id: str, title: str, question: str, metric_id: str, summary: str, chart_type: str, chart_data: Any, drivers: Any, filters: dict, definition: str, user: str):
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO saved_insights (id, title, question, metric_id, executive_summary, chart_type, chart_data, drivers, filters, semantic_definition, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (id, title, question, metric_id, summary, chart_type, json.dumps(chart_data), json.dumps(drivers), json.dumps(filters), definition, user))
        self.conn.commit()

db = WarehouseDatabase()
