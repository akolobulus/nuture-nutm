import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

interface ClaimDetails {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  description: string;
  category: string;
  status: string;
  submittedAt: Date;
  processedAt?: Date;
}

interface ListAllClaimsRequest {
  status?: Query<string>;
  limit?: Query<number>;
}

interface ListAllClaimsResponse {
  claims: ClaimDetails[];
}

// Retrieves all claims for admin
export const listAllClaims = api<ListAllClaimsRequest, ListAllClaimsResponse>(
  { method: "GET", path: "/admin/claims", expose: true },
  async ({ status, limit }) => {
    let query = `
      SELECT c.id, u.full_name as user_name, u.email as user_email,
             c.amount, c.description, c.category, c.status,
             c.submitted_at, c.processed_at
      FROM claims c
      JOIN users u ON c.user_id = u.id
    `;
    
    const params: string[] = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` WHERE c.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ` ORDER BY c.submitted_at DESC`;
    
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(limit.toString());
    }
    
    const rows = await db.rawQueryAll<{
      id: string;
      user_name: string;
      user_email: string;
      amount: number;
      description: string;
      category: string;
      status: string;
      submitted_at: Date;
      processed_at: Date | null;
    }>(query, ...params);
    
    const claims = rows.map(row => ({
      id: row.id,
      userName: row.user_name,
      userEmail: row.user_email,
      amount: row.amount,
      description: row.description,
      category: row.category,
      status: row.status,
      submittedAt: row.submitted_at,
      processedAt: row.processed_at || undefined,
    }));
    
    return { claims };
  }
);
