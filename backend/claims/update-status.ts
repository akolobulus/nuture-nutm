import { api, APIError } from "encore.dev/api";
import db from "../db";

interface UpdateClaimStatusRequest {
  claimId: string;
  status: string;
  rejectionReason?: string;
}

interface UpdateClaimStatusResponse {
  success: boolean;
}

// Updates the status of a claim (for admin use)
export const updateStatus = api<UpdateClaimStatusRequest, UpdateClaimStatusResponse>(
  { method: "POST", path: "/claims/update-status", expose: true },
  async (req) => {
    const claim = await db.queryRow`SELECT id FROM claims WHERE id = ${req.claimId}`;
    
    if (!claim) {
      throw APIError.notFound("claim not found");
    }
    
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(req.status)) {
      throw APIError.invalidArgument("invalid status");
    }
    
    const now = new Date();
    
    await db.exec`
      UPDATE claims 
      SET status = ${req.status}, 
          rejection_reason = ${req.rejectionReason || null},
          processed_at = ${now},
          updated_at = NOW()
      WHERE id = ${req.claimId}
    `;
    
    return { success: true };
  }
);
