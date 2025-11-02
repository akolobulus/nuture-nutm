import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";
import { randomUUID } from "crypto";

interface CreateSubscriptionRequest {
  planId: string;
  autoRenew?: boolean;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

// Creates a new insurance subscription for a user
export const create = api<CreateSubscriptionRequest, Subscription>(
  { method: "POST", path: "/subscriptions", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    
    const plan = await db.queryRow`SELECT id FROM insurance_plans WHERE id = ${req.planId}`;
    if (!plan) {
      throw APIError.notFound("plan not found");
    }
    
    const activeSubscription = await db.queryRow`
      SELECT id FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active'
    `;
    
    if (activeSubscription) {
      throw APIError.alreadyExists("user already has an active subscription");
    }
    
    const id = randomUUID();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    await db.exec`
      INSERT INTO subscriptions (id, user_id, plan_id, status, start_date, end_date, auto_renew)
      VALUES (${id}, ${userId}, ${req.planId}, 'active', ${startDate}, ${endDate}, ${req.autoRenew ?? true})
    `;
    
    const subscription = await db.queryRow<{
      id: string;
      user_id: string;
      plan_id: string;
      status: string;
      start_date: Date;
      end_date: Date;
      auto_renew: boolean;
    }>`
      SELECT id, user_id, plan_id, status, start_date, end_date, auto_renew
      FROM subscriptions WHERE id = ${id}
    `;
    
    return {
      id: subscription!.id,
      userId: subscription!.user_id,
      planId: subscription!.plan_id,
      status: subscription!.status,
      startDate: subscription!.start_date,
      endDate: subscription!.end_date,
      autoRenew: subscription!.auto_renew,
    };
  }
);
