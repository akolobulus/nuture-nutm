import { api } from "encore.dev/api";
import db from "../db";

interface InsurancePlan {
  id: string;
  name: string;
  tier: string;
  coverageLimit: number;
  monthlyPrice: number;
  description: string;
  features: string[];
}

interface ListPlansResponse {
  plans: InsurancePlan[];
}

// Retrieves all active insurance plans
export const list = api<void, ListPlansResponse>(
  { method: "GET", path: "/plans", expose: true },
  async () => {
    const rows = await db.queryAll<{
      id: string;
      name: string;
      tier: string;
      coverage_limit: number;
      monthly_price: number;
      description: string;
      features: string;
    }>`
      SELECT id, name, tier, coverage_limit, monthly_price, description, features
      FROM insurance_plans
      WHERE active = true
      ORDER BY monthly_price ASC
    `;
    
    const plans = rows.map(row => ({
      id: row.id,
      name: row.name,
      tier: row.tier,
      coverageLimit: row.coverage_limit,
      monthlyPrice: row.monthly_price,
      description: row.description || "",
      features: JSON.parse(row.features) as string[],
    }));
    
    return { plans };
  }
);
