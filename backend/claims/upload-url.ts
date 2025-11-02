import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import { claimDocuments } from "../storage";
import { randomUUID } from "crypto";

interface GenerateUploadUrlRequest {
  fileName: string;
}

interface GenerateUploadUrlResponse {
  uploadUrl: string;
  fileId: string;
  publicUrl: string;
}

// Generates a signed URL for uploading claim documents
export const uploadUrl = api<GenerateUploadUrlRequest, GenerateUploadUrlResponse>(
  { method: "POST", path: "/claims/upload-url", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;
    const fileId = `${userId}/${randomUUID()}-${req.fileName}`;
    
    const { url } = await claimDocuments.signedUploadUrl(fileId, {
      ttl: 3600,
    });
    
    const { url: downloadUrl } = await claimDocuments.signedDownloadUrl(fileId, {
      ttl: 86400 * 365,
    });
    
    return {
      uploadUrl: url,
      fileId,
      publicUrl: downloadUrl,
    };
  }
);
