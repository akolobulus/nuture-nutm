import { api, APIError } from "encore.dev/api";
import db from "../db";

interface User {
  id: string;
  email: string;
  nutmId: string;
  fullName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  address?: string;
  verified: boolean;
  createdAt: Date;
}

// Retrieves a user by ID
export const get = api<void, User>(
  { method: "GET", path: "/users/me", expose: true, auth: true },
  async () => {
    const auth = require("~encore/auth").getAuthData()! as { userID: string };
    const userId = auth.userID;

    const user = await db.queryRow<{
      id: string;
      email: string;
      nutm_id: string;
      full_name: string;
      phone_number?: string;
      profile_picture_url?: string;
      bio?: string;
      date_of_birth?: Date;
      address?: string;
      verified: boolean;
      created_at: Date;
    }>`
      SELECT id, email, nutm_id, full_name, phone_number, profile_picture_url,
             bio, date_of_birth, address, verified, created_at
      FROM users WHERE id = ${userId}
    `;
    
    if (!user) {
      throw APIError.notFound("user not found");
    }
    
    return {
      id: user.id,
      email: user.email,
      nutmId: user.nutm_id,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      profilePictureUrl: user.profile_picture_url,
      bio: user.bio,
      dateOfBirth: user.date_of_birth?.toISOString().split('T')[0],
      address: user.address,
      verified: user.verified,
      createdAt: user.created_at,
    };
  }
);
