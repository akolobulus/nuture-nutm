import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";
import { randomUUID } from "crypto";

interface CreatePaymentRequest {
  subscriptionId: string;
  amount: number;
  paymentMethod: string;
}

interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  status: string;
  transactionId: string;
  paymentDate: Date;
}

// Processes a mock payment for a subscription
export const create = api<CreatePaymentRequest, Payment>(
  { method: "POST", path: "/payments", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    
    const subscription = await db.queryRow`
      SELECT id FROM subscriptions 
      WHERE id = ${req.subscriptionId} AND user_id = ${userId}
    `;
    
    if (!subscription) {
      throw APIError.notFound("subscription not found");
    }
    
    const id = randomUUID();
    const transactionId = `TXN-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const status = "completed";
    const paymentDate = new Date();
    
    await db.exec`
      INSERT INTO payments (id, user_id, subscription_id, amount, status, payment_method, transaction_id, payment_date)
      VALUES (${id}, ${userId}, ${req.subscriptionId}, ${req.amount}, ${status}, 
              ${req.paymentMethod}, ${transactionId}, ${paymentDate})
    `;
    
    const payment = await db.queryRow<{
      id: string;
      user_id: string;
      subscription_id: string;
      amount: number;
      status: string;
      transaction_id: string;
      payment_date: Date;
    }>`
      SELECT id, user_id, subscription_id, amount, status, transaction_id, payment_date
      FROM payments WHERE id = ${id}
    `;
    
    return {
      id: payment!.id,
      userId: payment!.user_id,
      subscriptionId: payment!.subscription_id,
      amount: payment!.amount,
      status: payment!.status,
      transactionId: payment!.transaction_id,
      paymentDate: payment!.payment_date,
    };
  }
);
