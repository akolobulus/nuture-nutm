import { api, APIError } from "encore.dev/api";
import db from "../db";

interface User {
  id: string;
  email: string;
  nutmId: string;
  fullName: string;
  phoneNumber?: string;
  verified: boolean;
  createdAt: Date;
}

// Retrieves a user by ID
export const get = api<{ id: string }, User>(
  { method: "GET", path: "/users/:id", expose: true },
  async ({ id }) => {
    const user = await db.queryRow<User>`
      SELECT id, email, nutm_id as "nutmId", full_name as "fullName",
             phone_number as "phoneNumber", verified, created_at as "createdAt"
      FROM users WHERE id = ${id}
    `;
    
    if (!user) {
      throw APIError.notFound("user not found");
    }
    
    return user;
  }
);
