import { apiRequest } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: "CUSTOMER" | "COURIER" | "ADMIN";
  profileImage?: string | null;
}

interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}

export async function getMe(): Promise<AuthUser> {
  const response = await apiRequest<MeResponse>("/user/me");

  if (!response?.data?.user) {
    throw new Error("Unable to fetch authenticated user");
  }

  return response.data.user;
}
