import { api, APIError } from "encore.dev/api";
import db from "../db";

interface CompleteReferralRequest {
  referredEmail: string;
  referredId: string;
}

interface CompleteReferralResponse {
  success: boolean;
}

// Marks a referral as completed when the referred user signs up
export const complete = api<CompleteReferralRequest, CompleteReferralResponse>(
  { method: "POST", path: "/referrals/complete", expose: true },
  async (req) => {
    const referral = await db.queryRow`
      SELECT id FROM referrals 
      WHERE referred_email = ${req.referredEmail} AND status = 'pending'
    `;
    
    if (!referral) {
      return { success: false };
    }
    
    const now = new Date();
    
    await db.exec`
      UPDATE referrals 
      SET referred_id = ${req.referredId}, 
          status = 'completed',
          completed_at = ${now}
      WHERE referred_email = ${req.referredEmail} AND status = 'pending'
    `;
    
    return { success: true };
  }
);
