import { apiRequest } from "@/lib/api/client";

export type CourierAvailability =
  | "AVAILABLE"
  | "BUSY"
  | "OFFLINE"
  | "SUSPENDED";

export interface CourierDashboard {
  employeeId: string;
  availabilityStatus: CourierAvailability;
  totalDeliveries: number;
  totalEarnings: number | string;
  rating: number | string;
  pendingAssignments: number;
  acceptedAssignments: number;
  completedAssignments: number;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type CourierAssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";

export interface CourierAssignment {
  id: string;
  status: CourierAssignmentStatus;
  shipmentId?: string;
  shipment: {
    id: string;
    trackingNumber?: string;
    status?: string;
    serviceType?: string;
    packageType?: string;
    deliveryFee?: number | string;
    createdAt?: string;
  };
}

export async function getCourierDashboard(): Promise<CourierDashboard> {
  const response = await apiRequest<ApiResponse<CourierDashboard>>(
    "/couriers/dashboard",
  );

  if (!response?.success || !response.data) {
    throw new Error("Failed to load courier dashboard.");
  }

  return response.data;
}

export async function updateCourierAvailability(
  availabilityStatus: Exclude<CourierAvailability, "SUSPENDED">,
) {
  const response = await apiRequest<ApiResponse<CourierDashboard>>(
    "/couriers/availability",
    {
      method: "PATCH",
      body: JSON.stringify({ availabilityStatus }),
    },
  );

  if (!response?.success) {
    throw new Error("Failed to update availability.");
  }

  return response;
}

export async function acceptAssignment(id: string) {
  return apiRequest<ApiResponse<unknown>>(
    `/couriers/assignments/${id}/accept`,
    { method: "PATCH" },
  );
}

export async function rejectAssignment(id: string, reason?: string) {
  return apiRequest<ApiResponse<unknown>>(
    `/couriers/assignments/${id}/reject`,
    {
      method: "PATCH",
      body: JSON.stringify(reason ? { reason } : {}),
    },
  );
}

export async function completeAssignment(id: string) {
  return apiRequest<ApiResponse<unknown>>(
    `/couriers/assignments/${id}/complete`,
    { method: "PATCH" },
  );
}

export async function getCourierAssignments(): Promise<CourierAssignment[]> {
  const response = await apiRequest<ApiResponse<CourierAssignment[]>>(
    "/couriers/assignments",
  );

  if (!response?.success || !Array.isArray(response.data)) {
    throw new Error("Failed to load assignments.");
  }

  return response.data;
}
