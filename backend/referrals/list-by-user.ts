import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

interface Referral {
  id: string;
  referredEmail: string;
  referredName?: string;
  status: string;
  rewardAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

interface ListUserReferralsResponse {
  referrals: Referral[];
  totalRewards: number;
}

// Retrieves all referrals made by a user
export const listByUser = api<void, ListUserReferralsResponse>(
  { method: "GET", path: "/referrals/me", expose: true, auth: true },
  async () => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    const rows = await db.queryAll<{
      id: string;
      referred_email: string;
      referred_name: string | null;
      status: string;
      reward_amount: number;
      created_at: Date;
      completed_at: Date | null;
    }>`
      SELECT r.id, r.referred_email, u.full_name as referred_name, 
             r.status, r.reward_amount, r.created_at, r.completed_at
      FROM referrals r
      LEFT JOIN users u ON r.referred_id = u.id
      WHERE r.referrer_id = ${userId}
      ORDER BY r.created_at DESC
    `;
    
    const referrals = rows.map(row => ({
      id: row.id,
      referredEmail: row.referred_email,
      referredName: row.referred_name || undefined,
      status: row.status,
      rewardAmount: row.reward_amount,
      createdAt: row.created_at,
      completedAt: row.completed_at || undefined,
    }));
    
    const totalRewards = referrals
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.rewardAmount, 0);
    
    return { referrals, totalRewards };
  }
);
