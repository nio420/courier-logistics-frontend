import { apiRequest } from "@/lib/api/client";

export type ShipmentStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "PICKUP_SCHEDULED"
  | "COURIER_ASSIGNED"
  | "PICKED_UP"
  | "AT_ORIGIN_HUB"
  | "IN_TRANSIT"
  | "AT_DESTINATION_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERY_FAILED"
  | "RETURN_TO_SENDER"
  | "RETURNED"
  | "DELIVERED"
  | "CANCELLED";

export type ShipmentServiceType = "STANDARD" | "EXPRESS";

export type ShipmentPackageType =
  | "DOCUMENT"
  | "PARCEL"
  | "FRAGILE"
  | "ELECTRONICS"
  | "OTHER";

export interface AdminShipmentAddress {
  id?: string;
  label?: string;
  contactName?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

export interface AdminShipmentHub {
  id: string;
  name: string;
  code: string;
  city?: string;
  district?: string;
}

export interface AdminShipmentItem {
  id?: string;
  name: string;
  description?: string | null;
  quantity: number;
  weight: number | string;
  declaredValue: number | string;
}

export interface ShipmentTrackingEntry {
  id: string;
  status: ShipmentStatus;
  note?: string | null;
  createdAt: string;
  hubId?: string | null;
  courierId?: string | null;
}

export interface AdminShipment {
  id: string;
  trackingNumber: string;
  customerId?: string;
  courierId?: string | null;
  serviceType: ShipmentServiceType;
  packageType: ShipmentPackageType;
  weight: number | string;
  deliveryFee: number | string;
  paymentStatus: string;
  status: ShipmentStatus;
  pickupDate?: string | null;
  estimatedDeliveryDate?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  senderAddress?: AdminShipmentAddress;
  receiverAddress?: AdminShipmentAddress;
  originHub?: AdminShipmentHub | null;
  destinationHub?: AdminShipmentHub | null;
  items?: AdminShipmentItem[];
  tracking?: ShipmentTrackingEntry[];
  customer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  courier?: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
  } | null;
}

export interface ShipmentPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface AdminShipmentList {
  shipments: AdminShipment[];
  meta: ShipmentPagination;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminShipmentQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: ShipmentStatus;
  serviceType?: ShipmentServiceType;
  packageType?: ShipmentPackageType;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AssignableCourier {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  status: string;
  courierApprovalStatus: string | null;
  courier: {
    availabilityStatus: string;
    employeeId?: string | null;
  } | null;
}

export async function getAdminShipments(
  query: AdminShipmentQuery,
): Promise<AdminShipmentList> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const response = await apiRequest<ApiResponse<AdminShipmentList>>(
    `/shipments?${params.toString()}`,
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load shipments.");
  }

  return response.data;
}

export async function getAdminShipmentById(id: string): Promise<AdminShipment> {
  const response = await apiRequest<ApiResponse<AdminShipment>>(
    `/shipments/${id}`,
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load shipment details.");
  }

  return response.data;
}

export async function updateAdminShipmentStatus(
  id: string,
  status: ShipmentStatus,
  note?: string,
): Promise<void> {
  const response = await apiRequest<ApiResponse<AdminShipment>>(
    `/shipments/status/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
        ...(note?.trim() ? { note: note.trim() } : {}),
      }),
    },
  );

  if (!response?.success) {
    throw new Error(response?.message || "Failed to update shipment status.");
  }
}

export async function assignShipmentCourier(
  shipmentId: string,
  courierId: string,
): Promise<void> {
  const response = await apiRequest<ApiResponse<unknown>>(
    `/shipments/assign-courier/${shipmentId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ courierId }),
    },
  );

  if (!response?.success) {
    throw new Error(response?.message || "Failed to assign courier.");
  }
}

export async function getAssignableCouriers(): Promise<AssignableCourier[]> {
  const params = new URLSearchParams({
    page: "1",
    limit: "100",
    approvalStatus: "APPROVED",
    availabilityStatus: "AVAILABLE",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const response = await apiRequest<
    ApiResponse<{ couriers: AssignableCourier[] }>
  >(`/admin/couriers?${params.toString()}`);

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load available couriers.");
  }

  // Email verification must be included in the backend courier response.
  return response.data.couriers.filter(
    (courier) =>
      courier.status === "ACTIVE" &&
      courier.courierApprovalStatus === "APPROVED" &&
      courier.courier?.availabilityStatus === "AVAILABLE" &&
      courier.emailVerified === true,
  );
}
