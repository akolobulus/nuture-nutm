import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";
import { randomUUID } from "crypto";

interface CreateReferralRequest {
  referredEmail: string;
}

interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: string;
  rewardAmount: number;
  createdAt: Date;
}

// Creates a new referral
export const create = api<CreateReferralRequest, Referral>(
  { method: "POST", path: "/referrals", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const referrerId = auth.userID;
    
    const existingReferral = await db.queryRow`
      SELECT id FROM referrals 
      WHERE referrer_id = ${referrerId} AND referred_email = ${req.referredEmail}
    `;
    
    if (existingReferral) {
      throw APIError.alreadyExists("referral already exists for this email");
    }
    
    const id = randomUUID();
    const rewardAmount = 500;
    
    await db.exec`
      INSERT INTO referrals (id, referrer_id, referred_email, reward_amount, status)
      VALUES (${id}, ${referrerId}, ${req.referredEmail}, ${rewardAmount}, 'pending')
    `;
    
    const referral = await db.queryRow<{
      id: string;
      referrer_id: string;
      referred_email: string;
      status: string;
      reward_amount: number;
      created_at: Date;
    }>`
      SELECT id, referrer_id, referred_email, status, reward_amount, created_at
      FROM referrals WHERE id = ${id}
    `;
    
    return {
      id: referral!.id,
      referrerId: referral!.referrer_id,
      referredEmail: referral!.referred_email,
      status: referral!.status,
      rewardAmount: referral!.reward_amount,
      createdAt: referral!.created_at,
    };
  }
);
