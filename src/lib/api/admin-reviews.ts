import { apiRequest } from "@/lib/api/client";

export interface AdminReviewUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
}

export interface AdminReviewShipment {
  id: string;
  trackingNumber: string;
  status: string;
  serviceType: string;
  packageType: string;
  weight: number | string;
  deliveryFee: number | string;
  paymentStatus: string;
  createdAt: string;
  deliveredAt: string | null;
}

export interface AdminReview {
  id: string;
  shipmentId: string;
  customerId: string;
  courierId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  customer: AdminReviewUser;
  courier: AdminReviewUser;
  shipment: AdminReviewShipment;
}

interface AdminReviewsResponse {
  success: boolean;
  message: string;
  data: AdminReview[];
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  const response = await apiRequest<AdminReviewsResponse>("/reviews/admin");

  if (!response?.success || !Array.isArray(response.data)) {
    throw new Error(response?.message || "Failed to load admin reviews.");
  }

  return response.data;
}
