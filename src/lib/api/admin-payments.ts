import { apiRequest } from "@/lib/api/client";

export interface AdminPayment {
  id: string;
  shipmentId: string;
  customerId: string;
  amount: number | string;
  currency: string;
  gateway: string;
  transactionId: string | null;
  gatewayPaymentId: string | null;
  status: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  shipment: {
    id: string;
    trackingNumber: string;
    serviceType: string;
    packageType: string;
    deliveryFee: number | string;
    paymentStatus: string;
    status: string;
  };
}

export interface AdminPaymentQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  gateway?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface AdminPaymentDetails extends AdminPayment {
  gatewayResponse: unknown;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  shipment: AdminPayment["shipment"] & {
    weight: number | string;
    createdAt: string;
    senderAddress: unknown;
    receiverAddress: unknown;
  };
}

export async function getAdminPayments(
  query: AdminPaymentQuery = {},
): Promise<AdminPaymentsResponse> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const endpoint = queryString
    ? `/payment/admin?${queryString}`
    : "/payment/admin";

  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: AdminPaymentsResponse;
  }>(endpoint);

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load payments");
  }

  return response.data;
}

export async function getAdminPaymentById(
  paymentId: string,
): Promise<AdminPaymentDetails> {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: AdminPaymentDetails;
  }>(`/payment/admin/${encodeURIComponent(paymentId)}`);

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load payment details");
  }

  return response.data;
}
