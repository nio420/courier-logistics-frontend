import { apiRequest } from "@/lib/api/client";

export interface ReviewCustomer {
  id: string;
  name: string;
  profileImage: string | null;
}

export interface Review {
  id: string;
  shipmentId: string;
  customerId: string;
  courierId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  customer: ReviewCustomer;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateReviewPayload {
  shipmentId: string;
  rating: number;
  comment?: string;
}

export async function getReviews(): Promise<Review[]> {
  const response = await apiRequest<ApiResponse<Review[]>>("/reviews");

  if (!response.success || !Array.isArray(response.data)) {
    throw new Error(response.message || "Failed to load reviews.");
  }

  return response.data;
}

export async function getCourierReviews(courierId: string): Promise<Review[]> {
  const response = await apiRequest<ApiResponse<Review[]>>(
    `/reviews/courier/${encodeURIComponent(courierId)}`,
  );

  if (!response.success || !Array.isArray(response.data)) {
    throw new Error(response.message || "Failed to load courier reviews.");
  }

  return response.data;
}

export async function createReview(
  payload: CreateReviewPayload,
): Promise<Review> {
  const response = await apiRequest<ApiResponse<Review>>("/reviews", {
    method: "POST",
    body: JSON.stringify({
      shipmentId: payload.shipmentId,
      rating: payload.rating,
      comment: payload.comment?.trim() || undefined,
    }),
  });

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to submit review.");
  }

  return response.data;
}

export async function getMyReviews(): Promise<Review[]> {
  const response = await apiRequest<ApiResponse<Review[]>>(
    "/reviews/my-reviews",
  );

  if (!response.success || !Array.isArray(response.data)) {
    throw new Error(response.message || "Failed to load your reviews.");
  }

  return response.data;
}
