import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";
import { randomUUID } from "crypto";

interface SubmitClaimRequest {
  amount: number;
  description: string;
  category: string;
  receiptUrls: string[];
}

interface Claim {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  description: string;
  category: string;
  status: string;
  receiptUrls: string[];
  submittedAt: Date;
}

// Submits a new insurance claim
export const submit = api<SubmitClaimRequest, Claim>(
  { method: "POST", path: "/claims", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    const subscription = await db.queryRow<{
      id: string;
      plan_id: string;
    }>`
      SELECT id, plan_id 
      FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active'
      ORDER BY created_at DESC LIMIT 1
    `;
    
    if (!subscription) {
      throw APIError.failedPrecondition("no active subscription found");
    }
    
    const plan = await db.queryRow<{ coverage_limit: number }>`
      SELECT coverage_limit 
      FROM insurance_plans 
      WHERE id = ${subscription.plan_id}
    `;
    
    if (!plan) {
      throw APIError.internal("plan not found");
    }
    
    if (req.amount > plan.coverage_limit) {
      throw APIError.invalidArgument(
        `claim amount exceeds coverage limit of ₦${plan.coverage_limit}`
      );
    }
    
    const totalClaimed = await db.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM claims
      WHERE subscription_id = ${subscription.id} AND status = 'approved'
    `;
    
    if (totalClaimed && (totalClaimed.total + req.amount) > plan.coverage_limit) {
      throw APIError.invalidArgument(
        "claim would exceed remaining coverage limit"
      );
    }
    
    const id = randomUUID();
    const now = new Date();
    
    await db.exec`
      INSERT INTO claims (id, user_id, subscription_id, amount, description, category, status, receipt_urls, submitted_at)
      VALUES (${id}, ${userId}, ${subscription.id}, ${req.amount}, ${req.description}, 
              ${req.category}, 'pending', ${req.receiptUrls}, ${now})
    `;
    
    const claim = await db.queryRow<{
      id: string;
      user_id: string;
      subscription_id: string;
      amount: number;
      description: string;
      category: string;
      status: string;
      receipt_urls: string[];
      submitted_at: Date;
    }>`
      SELECT id, user_id, subscription_id, amount, description, category, 
             status, receipt_urls, submitted_at
      FROM claims WHERE id = ${id}
    `;
    
    return {
      id: claim!.id,
      userId: claim!.user_id,
      subscriptionId: claim!.subscription_id,
      amount: claim!.amount,
      description: claim!.description,
      category: claim!.category,
      status: claim!.status,
      receiptUrls: claim!.receipt_urls,
      submittedAt: claim!.submitted_at,
    };
  }
);
