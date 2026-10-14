import { apiRequest } from "@/lib/api/client";

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
  monthlyRegistrations: {
    month: string;
    total: number;
  }[];
}

interface AdminOverviewResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminOverview;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const response = await apiRequest<AdminOverviewResponse>("/admin/overview");

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load admin overview");
  }

  return response.data;
}
