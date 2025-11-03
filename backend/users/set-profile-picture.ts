import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

interface SetProfilePictureRequest {
  profilePictureUrl: string;
}

interface SetProfilePictureResponse {
  success: boolean;
}

export const setProfilePicture = api<SetProfilePictureRequest, SetProfilePictureResponse>(
  { method: "PUT", path: "/users/profile-picture", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;

    await db.exec`
      UPDATE users 
      SET profile_picture_url = ${req.profilePictureUrl}, updated_at = NOW()
      WHERE id = ${userId}
    `;

    return { success: true };
  }
);
