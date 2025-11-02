import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

interface Policy {
  id: string;
  userName: string;
  userEmail: string;
  planName: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

interface ListPoliciesRequest {
  status?: Query<string>;
  limit?: Query<number>;
}

interface ListPoliciesResponse {
  policies: Policy[];
}

// Retrieves all insurance policies for admin
export const listPolicies = api<ListPoliciesRequest, ListPoliciesResponse>(
  { method: "GET", path: "/admin/policies", expose: true },
  async ({ status, limit }) => {
    let query = `
      SELECT s.id, u.full_name as user_name, u.email as user_email,
             p.name as plan_name, s.status, s.start_date, s.end_date
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN insurance_plans p ON s.plan_id = p.id
    `;
    
    const params: string[] = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` WHERE s.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ` ORDER BY s.created_at DESC`;
    
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(limit.toString());
    }
    
    const rows = await db.rawQueryAll<{
      id: string;
      user_name: string;
      user_email: string;
      plan_name: string;
      status: string;
      start_date: Date;
      end_date: Date;
    }>(query, ...params);
    
    const policies = rows.map(row => ({
      id: row.id,
      userName: row.user_name,
      userEmail: row.user_email,
      planName: row.plan_name,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
    }));
    
    return { policies };
  }
);
