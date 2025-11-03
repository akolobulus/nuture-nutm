import { api, APIError } from "encore.dev/api";
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
    if (!req.email.endsWith("@nutm.edu.ng")) {
      throw APIError.invalidArgument(
        "Only NUTM email addresses are allowed. Email must end with @nutm.edu.ng"
      );
    }

    if (!req.nutmId || req.nutmId.trim().length === 0) {
      throw APIError.invalidArgument("NUTM Student ID is required");
    }

    const existingUser = await db.queryRow`
      SELECT id FROM users WHERE email = ${req.email} OR nutm_id = ${req.nutmId}
    `;
    
    if (existingUser) {
      throw APIError.alreadyExists(
        "A user with this email or NUTM ID already exists"
      );
    }

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
