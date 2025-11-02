import { api, APIError } from "encore.dev/api";
import db from "../db";

interface CancelSubscriptionRequest {
  subscriptionId: string;
  userId: string;
}

interface CancelSubscriptionResponse {
  success: boolean;
}

// Cancels a user's subscription
export const cancel = api<CancelSubscriptionRequest, CancelSubscriptionResponse>(
  { method: "POST", path: "/subscriptions/cancel", expose: true },
  async (req) => {
    const subscription = await db.queryRow`
      SELECT id FROM subscriptions 
      WHERE id = ${req.subscriptionId} AND user_id = ${req.userId}
    `;
    
    if (!subscription) {
      throw APIError.notFound("subscription not found");
    }
    
    await db.exec`
      UPDATE subscriptions 
      SET status = 'cancelled', auto_renew = false, updated_at = NOW()
      WHERE id = ${req.subscriptionId}
    `;
    
    return { success: true };
  }
);
