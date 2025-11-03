import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  dateOfBirth?: string;
  address?: string;
}

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
}

export const updateProfile = api<UpdateProfileRequest, User>(
  { method: "PUT", path: "/users/profile", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;

    const user = await db.queryRow`SELECT id FROM users WHERE id = ${userId}`;
    if (!user) {
      throw APIError.notFound("user not found");
    }

    if (req.fullName !== undefined) {
      await db.exec`UPDATE users SET full_name = ${req.fullName}, updated_at = NOW() WHERE id = ${userId}`;
    }
    if (req.phoneNumber !== undefined) {
      await db.exec`UPDATE users SET phone_number = ${req.phoneNumber || null}, updated_at = NOW() WHERE id = ${userId}`;
    }
    if (req.bio !== undefined) {
      await db.exec`UPDATE users SET bio = ${req.bio || null}, updated_at = NOW() WHERE id = ${userId}`;
    }
    if (req.dateOfBirth !== undefined) {
      await db.exec`UPDATE users SET date_of_birth = ${req.dateOfBirth || null}, updated_at = NOW() WHERE id = ${userId}`;
    }
    if (req.address !== undefined) {
      await db.exec`UPDATE users SET address = ${req.address || null}, updated_at = NOW() WHERE id = ${userId}`;
    }

    const updatedUser = await db.queryRow<{
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
    }>`
      SELECT id, email, nutm_id, full_name, phone_number, profile_picture_url, 
             bio, date_of_birth, address, verified
      FROM users WHERE id = ${userId}
    `;

    return {
      id: updatedUser!.id,
      email: updatedUser!.email,
      nutmId: updatedUser!.nutm_id,
      fullName: updatedUser!.full_name,
      phoneNumber: updatedUser!.phone_number,
      profilePictureUrl: updatedUser!.profile_picture_url,
      bio: updatedUser!.bio,
      dateOfBirth: updatedUser!.date_of_birth?.toISOString().split('T')[0],
      address: updatedUser!.address,
      verified: updatedUser!.verified,
    };
  }
);
