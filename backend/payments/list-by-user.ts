import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId: string;
  paymentDate: Date;
}

interface ListUserPaymentsResponse {
  payments: Payment[];
}

// Retrieves all payments for a user
export const listByUser = api<void, ListUserPaymentsResponse>(
  { method: "GET", path: "/payments/me", expose: true, auth: true },
  async () => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    const rows = await db.queryAll<{
      id: string;
      amount: number;
      status: string;
      payment_method: string;
      transaction_id: string;
      payment_date: Date;
    }>`
      SELECT id, amount, status, payment_method, transaction_id, payment_date
      FROM payments
      WHERE user_id = ${userId}
      ORDER BY payment_date DESC
    `;
    
    const payments = rows.map(row => ({
      id: row.id,
      amount: row.amount,
      status: row.status,
      paymentMethod: row.payment_method,
      transactionId: row.transaction_id,
      paymentDate: row.payment_date,
    }));
    
    return { payments };
  }
);
