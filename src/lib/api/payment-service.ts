import { apiRequest } from "@/lib/api/client";

export interface Payment {
  id: string;
  shipmentId: string;
  customerId: string;
  amount: string;
  currency: string;
  gateway: string;
  transactionId: string | null;
  gatewayPaymentId: string | null;
  status: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  shipment?: {
    trackingNumber: string;
    serviceType: string;
    packageType: string;
    deliveryFee: string;
    status: string;
  } | null;
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface PaymentListResponse {
  success: boolean;
  message: string;
  data: {
    payments: Payment[];
    meta: PaymentMeta;
  };
}

interface PaymentDetailsResponse {
  success: boolean;
  message: string;
  data: Payment | { payment: Payment };
}

export async function getPayments(
  page = 1,
  limit = 10,
): Promise<{ payments: Payment[]; meta: PaymentMeta }> {
  const response = await apiRequest<PaymentListResponse>(
    `/payment?page=${page}&limit=${limit}`,
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to load payment history.");
  }

  return {
    payments: response.data.payments,
    meta: response.data.meta,
  };
}

export async function getPaymentById(id: string): Promise<Payment> {
  if (!id || typeof id !== "string") {
    throw new Error("A valid payment ID is required.");
  }

  const response = await apiRequest<PaymentDetailsResponse>(
    `/payment/${encodeURIComponent(id)}`,
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to load payment details.");
  }

  const data = response.data;
  const payment = "payment" in data ? data.payment : data;

  if (!payment?.id) {
    throw new Error("The payment details response is invalid.");
  }

  return payment;
}
