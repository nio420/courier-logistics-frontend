import { apiRequest } from "@/lib/api/client";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "COURIER";
  vehicleType?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ApiMessageResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "COURIER" | "ADMIN";
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: AuthUser;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface MeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuthUser;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiMessageResponse> {
  return apiRequest<ApiMessageResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiRequest<MeResponse>("/auth/me");

  // FIX 2: Response Handle Validation
  if (!response || !response.data) {
    throw new Error("Failed to fetch user session");
  }

  return response.data;
}

export async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<ApiMessageResponse> {
  return apiRequest<ApiMessageResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendOtp(payload: {
  email: string;
}): Promise<ApiMessageResponse> {
  return apiRequest<ApiMessageResponse>("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getGoogleLoginUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not configured.");
  }

  return `${apiUrl}/auth/google`;
}

export async function sendForgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const logoutUser = () => {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
};
