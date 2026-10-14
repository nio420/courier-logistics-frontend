import { apiRequest } from "@/lib/api/client";

export interface TrackingLocation {
  latitude: number;
  longitude: number;
}

export interface TrackingHub {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  district: string;
  latitude: string;
  longitude: string;
  status: string;
}

export interface TrackingPerson {
  id: string;
  name: string;
  email: string;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: string;
  hubId: string | null;
  courierId: string | null;
  updatedBy: string;
  location: TrackingLocation | null;
  note: string | null;
  metadata: unknown;
  createdAt: string;
  hub: TrackingHub | null;
  courier: TrackingPerson | null;
  updater: TrackingPerson | null;
}

export interface ShipmentAddress {
  id: string;
  label: string;
  contactName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}

export interface TrackedShipment {
  id: string;
  trackingNumber: string;
  customerId: string;
  courierId: string | null;
  serviceType: string;
  packageType: string;
  weight: string;
  deliveryFee: string;
  paymentStatus: string;
  status: string;
  pickupDate: string | null;
  estimatedDeliveryDate: string | null;
  deliveredAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  senderAddress: ShipmentAddress;
  receiverAddress: ShipmentAddress;
  originHub: TrackingHub | null;
  destinationHub: TrackingHub | null;
  tracking: TrackingEvent[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getShipmentTracking(
  trackingNumber: string,
): Promise<TrackedShipment> {
  const response = await apiRequest<ApiResponse<TrackedShipment>>(
    `/tracking/${encodeURIComponent(trackingNumber)}`,
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to track shipment.");
  }

  return response.data;
}

export async function getTrackingHistory(
  shipmentId: string,
): Promise<TrackingEvent[]> {
  const response = await apiRequest<ApiResponse<TrackingEvent[]>>(
    `/tracking/tracking-history/${encodeURIComponent(shipmentId)}`,
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to load tracking history.");
  }

  return response.data;
}
