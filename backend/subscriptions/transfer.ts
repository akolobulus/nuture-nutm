import { api, APIError } from "encore.dev/api";
import db from "../db";

interface TransferSubscriptionRequest {
  subscriptionId: string;
  currentUserId: string;
  newUserId: string;
}

interface TransferSubscriptionResponse {
  success: boolean;
}

// Transfers a subscription from one student to another
export const transfer = api<TransferSubscriptionRequest, TransferSubscriptionResponse>(
  { method: "POST", path: "/subscriptions/transfer", expose: true },
  async (req) => {
    const subscription = await db.queryRow`
      SELECT id FROM subscriptions 
      WHERE id = ${req.subscriptionId} AND user_id = ${req.currentUserId} AND status = 'active'
    `;
    
    if (!subscription) {
      throw APIError.notFound("active subscription not found");
    }
    
    const newUser = await db.queryRow`SELECT id FROM users WHERE id = ${req.newUserId}`;
    if (!newUser) {
      throw APIError.notFound("new user not found");
    }
    
    const existingSubscription = await db.queryRow`
      SELECT id FROM subscriptions WHERE user_id = ${req.newUserId} AND status = 'active'
    `;
    
    if (existingSubscription) {
      throw APIError.alreadyExists("new user already has an active subscription");
    }
    
    await db.exec`
      UPDATE subscriptions 
      SET user_id = ${req.newUserId}, updated_at = NOW()
      WHERE id = ${req.subscriptionId}
    `;
    
    return { success: true };
  }
);
