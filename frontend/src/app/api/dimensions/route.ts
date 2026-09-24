import { NextResponse } from "next/server";

export async function GET() {
  const dimensions = [
    { name: "order_date", display_name: "Order Date", type: "DATE", grain: ["day", "month", "quarter", "year"] },
    { name: "region_name", display_name: "Region", type: "CATEGORICAL", sample_values: ["Central Europe", "Western Europe", "US East & West", "South Asia", "East Asia"] },
    { name: "country", display_name: "Country", type: "CATEGORICAL", sample_values: ["Germany", "France", "United Kingdom", "United States", "India", "Japan", "Canada"] },
    { name: "continent", display_name: "Continent", type: "CATEGORICAL", sample_values: ["Europe", "North America", "Asia"] },
    { name: "customer_name", display_name: "Customer Account", type: "CATEGORICAL", sample_values: ["EuroTech GmbH", "Paris Retail Group", "Chennai Digital Pvt Ltd"] },
    { name: "customer_segment", display_name: "Segment", type: "CATEGORICAL", sample_values: ["Enterprise", "Mid-Market", "Strategic"] },
    { name: "product_name", display_name: "Product", type: "CATEGORICAL", sample_values: ["Analytics Platform", "AI Assistant", "Data Warehouse License"] },
    { name: "category", display_name: "Category", type: "CATEGORICAL", sample_values: ["Analytics", "AI & ML", "Data Infrastructure", "Visualization", "Professional Services"] },
    { name: "subcategory", display_name: "Subcategory", type: "CATEGORICAL", sample_values: ["Core Software", "Copilots", "Storage & Compute", "Reporting Tools"] }
  ];

  return NextResponse.json(dimensions);
}
