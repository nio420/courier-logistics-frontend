export interface Hub {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  district: string;
}

export interface ShipmentAddress {
  label: string;
  contactName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface ShipmentItem {
  name: string;
  description?: string;
  quantity: number;
  weight: number;
  declaredValue: number;
}

export interface CreatedShipment {
  id: string;
  trackingNumber: string;
  paymentStatus: string;
  status: string;
  deliveryFee: number | string;
}

export interface CreateShipmentResult {
  shipment: CreatedShipment;
  distance: number;
  deliveryFee: number | string;
}

export interface CreateShipmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreateShipmentResult;
}

export interface CreateShipmentPayload {
  senderAddress: ShipmentAddress;
  receiverAddress: ShipmentAddress;
  originHubId: string;
  destinationHubId: string;
  serviceType: "STANDARD" | "EXPRESS";
  packageType: "DOCUMENT" | "PARCEL" | "FRAGILE" | "ELECTRONICS" | "OTHER";
  weight: number;
  items: ShipmentItem[];
  pickupDate?: string;
  estimatedDeliveryDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentUrl: string | null;
    sessionId: string;
  };
}

export interface ShipmentAddress {
  label: string;
  contactName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface ShipmentHub {
  id: string;
  name: string;
  code: string;
  city: string;
  district: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  serviceType: string;
  packageType: string;
  weight: string;
  deliveryFee: string;
  paymentStatus: string;
  status: string;
  pickupDate: string | null;
  estimatedDeliveryDate: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  senderAddress: ShipmentAddress;
  receiverAddress: ShipmentAddress;
  originHub: ShipmentHub | null;
  destinationHub: ShipmentHub | null;
}

export interface ShipmentPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface MyShipmentsResult {
  shipments: Shipment[];
  meta: ShipmentPagination;
}

export interface MyShipmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    shipments: Shipment[];
    meta: ShipmentPagination;
  };
}
