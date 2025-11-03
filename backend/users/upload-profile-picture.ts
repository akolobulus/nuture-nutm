import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import { profilePictures } from "../storage";

interface UploadProfilePictureResponse {
  uploadUrl: string;
  fileUrl: string;
}

export const uploadProfilePicture = api<void, UploadProfilePictureResponse>(
  { method: "POST", path: "/users/profile-picture/upload-url", expose: true, auth: true },
  async () => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    
    const objectName = `${userId}/${Date.now()}.jpg`;
    const { url } = await profilePictures.signedUploadUrl(objectName);
    const fileUrl = profilePictures.publicUrl(objectName);
    
    return { uploadUrl: url, fileUrl };
  }
);
