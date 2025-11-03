import { api, APIError } from "encore.dev/api";
import db from "../db";

interface GetPlanRequest {
  id: string;
}

interface InsurancePlan {
  id: string;
  name: string;
  tier: string;
  coverageLimit: number;
  monthlyPrice: number;
  description: string;
  features: string[];
}

export const get = api<GetPlanRequest, InsurancePlan>(
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
      features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features as string[],
    };
  }
);
