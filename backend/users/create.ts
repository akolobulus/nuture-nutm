import { api } from "encore.dev/api";
import db from "../db";
import { randomUUID } from "crypto";

interface CreateUserRequest {
  email: string;
  nutmId: string;
  fullName: string;
  phoneNumber?: string;
}

interface User {
  id: string;
  email: string;
  nutmId: string;
  fullName: string;
  phoneNumber?: string;
  verified: boolean;
  createdAt: Date;
}

// Creates a new user account
export const create = api<CreateUserRequest, User>(
  { method: "POST", path: "/users", expose: true },
  async (req) => {
    const id = randomUUID();
    
    await db.exec`
      INSERT INTO users (id, email, nutm_id, full_name, phone_number)
      VALUES (${id}, ${req.email}, ${req.nutmId}, ${req.fullName}, ${req.phoneNumber || null})
    `;
    
    const user = await db.queryRow<User>`
      SELECT id, email, nutm_id as "nutmId", full_name as "fullName", 
             phone_number as "phoneNumber", verified, created_at as "createdAt"
      FROM users WHERE id = ${id}
    `;
    
    return user!;
  }
);
