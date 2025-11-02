import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

interface Claim {
  id: string;
  amount: number;
  description: string;
  category: string;
  status: string;
  receiptUrls: string[];
  submittedAt: Date;
  processedAt?: Date;
  rejectionReason?: string;
}

interface ListUserClaimsRequest {
  status?: Query<string>;
}

interface ListUserClaimsResponse {
  claims: Claim[];
}

// Retrieves all claims for a user
export const listByUser = api<ListUserClaimsRequest, ListUserClaimsResponse>(
  { method: "GET", path: "/claims/me", expose: true, auth: true },
  async ({ status }) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    let query = `
      SELECT id, amount, description, category, status, receipt_urls, 
             submitted_at, processed_at, rejection_reason
      FROM claims
      WHERE user_id = $1
    `;
    
    const params: string[] = [userId];
    
    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }
    
    query += ` ORDER BY submitted_at DESC`;
    
    const rows = await db.rawQueryAll<{
      id: string;
      amount: number;
      description: string;
      category: string;
      status: string;
      receipt_urls: string[];
      submitted_at: Date;
      processed_at: Date | null;
      rejection_reason: string | null;
    }>(query, ...params);
    
    const claims = rows.map(row => ({
      id: row.id,
      amount: row.amount,
      description: row.description,
      category: row.category,
      status: row.status,
      receiptUrls: row.receipt_urls,
      submittedAt: row.submitted_at,
      processedAt: row.processed_at || undefined,
      rejectionReason: row.rejection_reason || undefined,
    }));
    
    return { claims };
  }
);
