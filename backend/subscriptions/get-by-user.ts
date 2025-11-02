import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

interface GetUserSubscriptionResponse {
  subscription: Subscription | null;
}

// Retrieves the active subscription for a user
export const getByUser = api<void, GetUserSubscriptionResponse>(
  { method: "GET", path: "/subscriptions/me", expose: true, auth: true },
  async () => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    const subscription = await db.queryRow<{
      id: string;
      user_id: string;
      plan_id: string;
      plan_name: string;
      status: string;
      start_date: Date;
      end_date: Date;
      auto_renew: boolean;
    }>`
      SELECT s.id, s.user_id, s.plan_id, p.name as plan_name, 
             s.status, s.start_date, s.end_date, s.auto_renew
      FROM subscriptions s
      JOIN insurance_plans p ON s.plan_id = p.id
      WHERE s.user_id = ${userId} AND s.status = 'active'
      ORDER BY s.created_at DESC
      LIMIT 1
    `;
    
    if (!subscription) {
      return { subscription: null };
    }
    
    return {
      subscription: {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        planName: subscription.plan_name,
        status: subscription.status,
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        autoRenew: subscription.auto_renew,
      },
    };
  }
);
