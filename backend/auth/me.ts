import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "./auth";

export interface UserInfo {
  id: string;
  email: string | null;
  imageUrl: string;
}

export const me = api<void, UserInfo>(
  {auth: true, expose: true, method: "GET", path: "/auth/me"},
  async () => {
    const auth = getAuthData()! as AuthData;
    return {
      id: auth.userID,
      email: auth.email,
      imageUrl: auth.imageUrl
    };
  }
);
