import { api, APIError } from "encore.dev/api";
import db from "../db";

interface VerifyUserRequest {
  userId: string;
}

interface VerifyUserResponse {
  success: boolean;
}

// Verifies a NUTM student account
export const verify = api<VerifyUserRequest, VerifyUserResponse>(
  { method: "POST", path: "/users/verify", expose: true },
  async (req) => {
    const user = await db.queryRow`SELECT id FROM users WHERE id = ${req.userId}`;
    
    if (!user) {
      throw APIError.notFound("user not found");
    }
    
    await db.exec`
      UPDATE users SET verified = true, updated_at = NOW()
      WHERE id = ${req.userId}
    `;
    
    return { success: true };
  }
);
