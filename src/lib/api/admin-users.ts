import { apiRequest } from "@/lib/api/client";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  courierApprovalStatus: string | null;
  authProvider: string;
  emailVerified: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface AdminUserQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: UserStatus;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminUserList {
  users: AdminUser[];
  meta: AdminUserMeta;
}

export interface AdminUserDetails extends AdminUser {
  courier: {
    employeeId: string | null;
    vehicleType: string | null;
    vehicleNumber: string | null;
    licenseNumber: string | null;
    availabilityStatus: string | null;
    totalDeliveries: number;
    totalEarnings: number | string;
    rating: number | string | null;
  } | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getAdminUsers(
  query: AdminUserQuery,
): Promise<AdminUserList> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const response = await apiRequest<ApiResponse<AdminUserList>>(
    "/admin/users?" + params.toString(),
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load customers.");
  }

  return response.data;
}

export async function getAdminUserById(id: string): Promise<AdminUserDetails> {
  const response = await apiRequest<ApiResponse<AdminUserDetails>>(
    "/admin/users/" + id,
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load customer details.");
  }

  return response.data;
}

export async function updateAdminUserStatus(
  id: string,
  status: UserStatus,
): Promise<void> {
  const response = await apiRequest<ApiResponse<AdminUser>>(
    "/admin/users/" + id + "/status",
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

  if (!response?.success) {
    throw new Error(response?.message || "Failed to update customer status.");
  }
}
