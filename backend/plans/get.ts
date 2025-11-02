import { api, APIError } from "encore.dev/api";
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

// Retrieves a specific insurance plan by ID
export const get = api<{ id: string }, InsurancePlan>(
  { method: "GET", path: "/plans/:id", expose: true },
  async ({ id }) => {
    const row = await db.queryRow<{
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
      WHERE id = ${id} AND active = true
    `;
    
    if (!row) {
      throw APIError.notFound("plan not found");
    }
    
    return {
      id: row.id,
      name: row.name,
      tier: row.tier,
      coverageLimit: row.coverage_limit,
      monthlyPrice: row.monthly_price,
      description: row.description || "",
      features: JSON.parse(row.features) as string[],
    };
  }
);
