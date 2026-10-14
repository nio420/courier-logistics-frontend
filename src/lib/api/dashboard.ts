import { apiRequest } from "@/lib/api/client";

export interface DashboardShipment {
  id: string;
  trackingNumber: string;
  status: string;
  serviceType: string;
  packageType: string;
  deliveryFee: string;
  createdAt: string;
}

export interface DashboardReview {
  id: string;
  shipmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  courier: {
    id: string;
    name: string;
    profileImage: string;
  };
  shipment: {
    trackingNumber: string;
  };
}

export interface CustomerDashboard {
  totalShipments: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
  cancelledShipments: number;
  totalPayments: number;
  totalSpent: number;
  totalReviews: number;
  recentShipments: DashboardShipment[];
  recentReviews: DashboardReview[];
}

interface DashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CustomerDashboard;
}

export async function getCustomerDashboard(): Promise<CustomerDashboard> {
  const response = await apiRequest<DashboardResponse>("/user/dashboard");

  if (!response?.success || !response.data) {
    throw new Error("Failed to load dashboard data.");
  }

  return response.data;
}
