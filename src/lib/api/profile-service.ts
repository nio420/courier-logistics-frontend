import { apiRequest } from "@/lib/api/client";

export interface CourierProfile {
  employeeId: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  availabilityStatus: string;
  currentLat: number | null;
  currentLng: number | null;
  totalDeliveries: number;
  totalEarnings: number;
  rating: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  profileImage: string | null;
  role: "CUSTOMER" | "COURIER" | "ADMIN";
  authProvider: string;
  emailVerified: boolean;
  status: string;
  courierApprovalStatus: string | null;
  createdAt: string;
  updatedAt: string;
  courier: CourierProfile | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
}

export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiRequest<ApiResponse<UserProfile>>("/user/me");

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to load profile.");
  }

  return response.data;
}

export async function updateMyProfile(
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const response = await apiRequest<ApiResponse<UserProfile>>(
    "/user/me-update",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to update profile.");
  }

  return response.data;
}

export async function uploadProfileImage(file: File): Promise<UserProfile> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await apiRequest<ApiResponse<UserProfile>>(
    "/user/profile-image",
    {
      method: "PATCH",
      body: formData,
      headers: {
        // Do not set Content-Type here.
        // fetch will add the multipart boundary automatically.
        Accept: "application/json",
      },
    },
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to upload profile image.");
  }

  return response.data;
}
