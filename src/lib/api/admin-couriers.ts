import { apiRequest } from "@/lib/api/client";

export type CourierApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminCourier {
  id: string;
  name: string;
  email: string;
  status: string;
  emailVerified: boolean;
  courierApprovalStatus: CourierApprovalStatus | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  courier: {
    employeeId: string | null;
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
    availabilityStatus: string;
    totalDeliveries: number;
    totalEarnings: number | string;
    rating: number | null;
  } | null;
}

export interface CourierListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface AdminCourierQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  approvalStatus?: CourierApprovalStatus;
  availabilityStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminCourierList {
  couriers: AdminCourier[];
  meta: CourierListMeta;
}

export interface AdminOverview {
  summary: {
    totalUsers: number;
    totalCustomers: number;
    totalCouriers: number;
    totalAdmins: number;
    pendingCouriers: number;
    approvedCouriers: number;
    rejectedCouriers: number;
  };
}

export type AdminCourierDetails = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  courierApprovalStatus: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  courier: {
    id: string;
    employeeId: string | null;
    vehicleType: string | null;
    vehicleNumber: string | null;
    licenseNumber: string | null;
    availabilityStatus: string | null;
    currentLat: number | null;
    currentLng: number | null;
    totalDeliveries: number;
    totalEarnings: number | string;
    rating: number | string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export async function getAdminCouriers(
  query: AdminCourierQuery,
): Promise<AdminCourierList> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const response = await apiRequest<ApiResponse<AdminCourierList>>(
    `/admin/couriers?${params.toString()}`,
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load couriers.");
  }

  return response.data;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const response =
    await apiRequest<ApiResponse<AdminOverview>>("/admin/overview");

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load courier statistics.");
  }

  return response.data;
}

export async function approveAdminCourier(userId: string): Promise<void> {
  const response = await apiRequest<ApiResponse<unknown>>(
    `/admin/approve/${userId}`,
    { method: "PATCH" },
  );

  if (!response?.success) {
    throw new Error(response?.message || "Failed to approve courier.");
  }
}

export async function rejectAdminCourier(
  userId: string,
  reason: string,
): Promise<void> {
  const response = await apiRequest<ApiResponse<unknown>>(
    `/admin/reject/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    },
  );

  if (!response?.success) {
    throw new Error(response?.message || "Failed to reject courier.");
  }
}

export async function getAdminCourierById(
  id: string,
): Promise<AdminCourierDetails> {
  const response = await apiRequest<ApiResponse<AdminCourierDetails>>(
    "/admin/courier/" + id,
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load courier details.");
  }

  return response.data;
}
