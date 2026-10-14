import { apiRequest } from "@/lib/api/client";
import type {
  ApiResponse,
  CreatePaymentResponse,
  CreateShipmentPayload,
  CreateShipmentResponse,
  Hub,
  MyShipmentsResponse,
  MyShipmentsResult,
} from "@/lib/api/shipments";

export async function getActiveHubs(): Promise<Hub[]> {
  const response = await apiRequest<ApiResponse<Hub[]>>("/hubs/active-hubs");

  return response.data;
}

export async function createShipment(
  payload: CreateShipmentPayload,
): Promise<CreateShipmentResponse> {
  return apiRequest<CreateShipmentResponse>("/shipments/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createPaymentSession(shipmentId: string) {
  return apiRequest<CreatePaymentResponse>("/payment/create", {
    method: "POST",
    body: JSON.stringify({ shipmentId }),
  });
}

export async function getMyShipments(): Promise<MyShipmentsResult> {
  const response = await apiRequest<MyShipmentsResponse>(
    "/shipments/my-shipments",
  );

  if (!response?.success || !response.data) {
    throw new Error("Failed to load shipments.");
  }

  return {
    shipments: response.data.shipments,
    meta: response.data.meta,
  };
}

export async function cancelShipment(id: string): Promise<void> {
  const response = await apiRequest<{
    success: boolean;
    message: string;
  }>(`/shipments/cancel/${id}`, {
    method: "PATCH",
  });

  if (!response?.success) {
    throw new Error(response?.message || "Failed to cancel shipment.");
  }
}

export async function getShipmentById(id: string) {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: import("@/lib/api/shipments").Shipment;
  }>(`/shipments/${id}`);

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load shipment details.");
  }

  return response.data;
}
