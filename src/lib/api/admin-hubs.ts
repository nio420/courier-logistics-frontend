import { apiRequest } from "@/lib/api/client";

export type HubStatus = "ACTIVE" | "INACTIVE";

export interface AdminHub {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  status: HubStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminHubQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: HubStatus | "";
  city?: string;
  district?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminHubsResponse {
  data: AdminHub[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateHubPayload {
  name: string;
  code: string;
  address: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  status?: HubStatus;
}

export interface UpdateHubPayload {
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  status?: HubStatus;
}

export async function getAdminHubs(
  query: AdminHubQuery = {},
): Promise<AdminHubsResponse> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const endpoint = queryString ? "/hubs?" + queryString : "/hubs";

  const response = await apiRequest<ApiResponse<AdminHubsResponse>>(endpoint);

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load hubs");
  }

  return response.data;
}

export async function getAdminHubById(id: string): Promise<AdminHub> {
  const response = await apiRequest<ApiResponse<AdminHub>>(
    "/hubs/" + encodeURIComponent(id),
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to load hub details");
  }

  return response.data;
}

export async function createAdminHub(
  payload: CreateHubPayload,
): Promise<AdminHub> {
  const response = await apiRequest<ApiResponse<AdminHub>>("/hubs", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to create hub");
  }

  return response.data;
}

export async function updateAdminHub(
  id: string,
  payload: UpdateHubPayload,
): Promise<AdminHub> {
  const response = await apiRequest<ApiResponse<AdminHub>>(
    "/hubs/" + encodeURIComponent(id),
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to update hub");
  }

  return response.data;
}

export async function deleteAdminHub(id: string): Promise<AdminHub> {
  const response = await apiRequest<ApiResponse<AdminHub>>(
    "/hubs/" + encodeURIComponent(id),
    {
      method: "DELETE",
    },
  );

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to deactivate hub");
  }

  return response.data;
}
