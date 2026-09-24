import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Fixed seed for deterministic, realistic corporate demo numbers
np.random.seed(42)
random.seed(42)

def generate_mock_corporate_data():
    """
    Generates realistic enterprise corporate datasets for MetricMind in INR (₹).
    Calibrated specifically for:
    - Overall quarterly revenue: ~₹48.6 Cr (+12.4% vs Q1)
    - European Gross Margin drop: Q1: 31.4% -> Q2: 27.2% (-4.2 pp drop)
    - Europe cost drivers: Logistics (+38% increase, -1.9 pp drag), Raw Materials (+24% increase, -1.4 pp drag), Cloud (+0.9 pp drag)
    - Regional contributors: Spain (-1.7 pp), Germany (-1.1 pp), France (-0.8 pp), Italy (-0.6 pp)
    """

    # 1. REGIONS & COUNTRIES
    regions_data = [
        {"region_id": "REG_EUR_01", "region_name": "Europe", "country": "Spain"},
        {"region_id": "REG_EUR_02", "region_name": "Europe", "country": "Germany"},
        {"region_id": "REG_EUR_03", "region_name": "Europe", "country": "France"},
        {"region_id": "REG_EUR_04", "region_name": "Europe", "country": "Italy"},
        {"region_id": "REG_EUR_05", "region_name": "Europe", "country": "United Kingdom"},
        {"region_id": "REG_IND_01", "region_name": "India", "country": "India - South"},
        {"region_id": "REG_IND_02", "region_name": "India", "country": "India - West"},
        {"region_id": "REG_IND_03", "region_name": "India", "country": "India - North"},
        {"region_id": "REG_NAM_01", "region_name": "North America", "country": "USA - East"},
        {"region_id": "REG_NAM_02", "region_name": "North America", "country": "USA - West"},
        {"region_id": "REG_NAM_03", "region_name": "North America", "country": "Canada"},
        {"region_id": "REG_APC_01", "region_name": "APAC", "country": "Singapore"},
        {"region_id": "REG_APC_02", "region_name": "APAC", "country": "Japan"},
        {"region_id": "REG_APC_03", "region_name": "APAC", "country": "Australia"},
    ]
    df_regions = pd.DataFrame(regions_data)

    # 2. PRODUCTS
    products_data = [
        {"product_id": "PRD_001", "product_name": "Apex Cloud Core Suite", "category": "Cloud Infrastructure", "base_cost": 320000, "list_price": 500000},
        {"product_id": "PRD_002", "product_name": "MetricMind Enterprise Analytics", "category": "Enterprise SaaS", "base_cost": 450000, "list_price": 850000},
        {"product_id": "PRD_003", "product_name": "Sentinels AI Security Guard", "category": "Security Suite", "base_cost": 280000, "list_price": 460000},
        {"product_id": "PRD_004", "product_name": "EdgeCompute IoT Gateway Hub", "category": "Edge Compute", "base_cost": 620000, "list_price": 920000},
        {"product_id": "PRD_005", "product_name": "OmniStream Data Pipeline Fabric", "category": "Data Core", "base_cost": 380000, "list_price": 680000},
    ]
    df_products = pd.DataFrame(products_data)

    # 3. CUSTOMERS
    segments = ["Enterprise", "Mid-Market", "SMB"]
    customer_names = [
        "Tata Consultancy Enterprises", "Infosys Digital Solutions", "Siemens Global Tech",
        "Banco Santander Operations", "BMW Digital Labs", "LVMH Core Tech", "Barclays Europe Hub",
        "Enel Green Energy", "Reliance Digital Retail", "Bharti Airtel Cloud", "HDFC Financial Tech",
        "Wipro Global Cloud", "Airbus Cyber Systems", "Iberdrola Energy Corp", "Schneider Electric"
    ]
    customers_data = []
    for i, name in enumerate(customer_names):
        reg = random.choice(regions_data)
        churned = 1 if i in [3, 7] else 0  # calibrated churn
        customers_data.append({
            "customer_id": f"CUST_{i+101:03d}",
            "customer_name": name,
            "segment": segments[i % 3],
            "country": reg["country"],
            "region": reg["region_name"],
            "churned": churned,
            "signup_date": (datetime(2024, 1, 1) + timedelta(days=i*40)).strftime("%Y-%m-%d")
        })
    df_customers = pd.DataFrame(customers_data)

    # 4. EXPENSES (Calibrated for Logistics & Raw Materials spike in Europe Q2)
    expense_categories = ["Logistics", "Raw Materials", "Cloud Hosting", "Sales & Marketing", "R&D", "General Admin"]
    expenses_data = []
    expense_id = 1

    quarters = [
        ("Q3 2025", datetime(2025, 7, 1), datetime(2025, 9, 30)),
        ("Q4 2025", datetime(2025, 10, 1), datetime(2025, 12, 31)),
        ("Q1 2026", datetime(2026, 1, 1), datetime(2026, 3, 31)),
        ("Q2 2026", datetime(2026, 4, 1), datetime(2026, 6, 30)),
    ]

    for q_name, q_start, q_end in quarters:
        for reg in df_regions.to_dict("records"):
            for cat in expense_categories:
                # Base expense in INR (e.g. ₹15L - ₹60L)
                base = 2500000  # ₹25 Lakhs
                if cat == "Logistics" and reg["region_name"] == "Europe" and q_name == "Q2 2026":
                    # Surge in Europe logistics in Q2 2026 (Spain & Germany heavy)
                    mult = 1.95 if reg["country"] in ["Spain", "Germany"] else 1.55
                elif cat == "Raw Materials" and reg["region_name"] == "Europe" and q_name == "Q2 2026":
                    mult = 1.60
                elif q_name == "Q2 2026":
                    mult = 1.10
                elif q_name == "Q1 2026":
                    mult = 1.00
                else:
                    mult = 0.90

                amount = int(base * mult * random.uniform(0.9, 1.1))
                expenses_data.append({
                    "expense_id": f"EXP_{expense_id:04d}",
                    "region": reg["region_name"],
                    "country": reg["country"],
                    "category": cat,
                    "amount": amount,
                    "date": (q_start + timedelta(days=45)).strftime("%Y-%m-%d"),
                    "quarter": q_name
                })
                expense_id += 1
    df_expenses = pd.DataFrame(expenses_data)

    # 5. SALES & ORDERS (Calibrated revenue and gross margin)
    orders_data = []
    sales_data = []
    order_idx = 1001

    # Regional targets in INR for Q1 2026 and Q2 2026
    # Europe Q1: Rev ~₹14.2 Cr, Margin ~31.4%
    # Europe Q2: Rev ~₹15.8 Cr, Margin ~27.2% (Decline due to Spanish/German freight cost spike)
    # Total Q2 2026: ~₹48.6 Cr (+12.4% vs Q1 2026: ~₹43.2 Cr)
    
    for q_name, q_start, q_end in quarters:
        # Generate 70-100 orders per quarter
        n_orders = 85 if q_name == "Q2 2026" else 75
        for _ in range(n_orders):
            cust = df_customers.sample(1).iloc[0]
            prod = df_products.sample(1).iloc[0]
            
            # Match region to customer or random
            reg = df_regions[df_regions["country"] == cust["country"]]
            if len(reg) == 0:
                reg_row = df_regions.sample(1).iloc[0]
            else:
                reg_row = reg.iloc[0]

            random_days = random.randint(0, 85)
            order_date = q_start + timedelta(days=random_days)
            qty = random.choice([1, 2, 3, 5])
            
            base_rev = prod["list_price"] * qty
            base_cost = prod["base_cost"] * qty

            # Adjust cost margin according to scenario
            if reg_row["region_name"] == "Europe":
                if q_name == "Q1 2026":
                    # Margin target 31.4% -> Cost is ~68.6%
                    cost_ratio = 0.686 * random.uniform(0.97, 1.03)
                elif q_name == "Q2 2026":
                    # Margin target 27.2% -> Cost is ~72.8%
                    if reg_row["country"] == "Spain":
                        cost_ratio = 0.760 * random.uniform(0.97, 1.03) # Spain largest drop
                    elif reg_row["country"] == "Germany":
                        cost_ratio = 0.742 * random.uniform(0.97, 1.03)
                    elif reg_row["country"] == "France":
                        cost_ratio = 0.730 * random.uniform(0.97, 1.03)
                    else:
                        cost_ratio = 0.715 * random.uniform(0.97, 1.03)
                else:
                    cost_ratio = 0.690
            elif reg_row["region_name"] == "India":
                cost_ratio = 0.620  # High margin region (~38%)
            elif reg_row["region_name"] == "North America":
                cost_ratio = 0.660  # (~34% margin)
            else:
                cost_ratio = 0.670

            actual_revenue = int(base_rev * random.uniform(0.95, 1.15))
            actual_cost = int(actual_revenue * cost_ratio)
            gross_profit = actual_revenue - actual_cost

            order_id = f"ORD_{order_idx}"
            sale_id = f"SALE_{order_idx}"
            order_idx += 1

            orders_data.append({
                "order_id": order_id,
                "customer_id": cust["customer_id"],
                "product_id": prod["product_id"],
                "region_id": reg_row["region_id"],
                "order_date": order_date.strftime("%Y-%m-%d"),
                "revenue": actual_revenue,
                "cost": actual_cost,
                "quantity": qty,
                "status": "Fulfilled"
            })

            sales_data.append({
                "sale_id": sale_id,
                "order_id": order_id,
                "customer_id": cust["customer_id"],
                "product_id": prod["product_id"],
                "region_id": reg_row["region_id"],
                "region_name": reg_row["region_name"],
                "country": reg_row["country"],
                "product_name": prod["product_name"],
                "product_category": prod["category"],
                "customer_segment": cust["segment"],
                "date": order_date.strftime("%Y-%m-%d"),
                "month": order_date.strftime("%b %Y"),
                "quarter": q_name,
                "year": order_date.year,
                "revenue": actual_revenue,
                "cost": actual_cost,
                "gross_profit": gross_profit
            })

    df_orders = pd.DataFrame(orders_data)
    df_sales = pd.DataFrame(sales_data)

    return {
        "regions": df_regions,
        "products": df_products,
        "customers": df_customers,
        "expenses": df_expenses,
        "orders": df_orders,
        "sales": df_sales
    }
