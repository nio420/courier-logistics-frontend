const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
  message?: string;
  errors?: Array<{ message?: string }>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  // Support both JSON requests and FormData file uploads.
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(!isFormData && {
      "Content-Type": "application/json",
    }),
    ...(options.headers as Record<string, string>),
  };

  // Let the browser set the multipart boundary for FormData.
  if (isFormData) {
    delete headers["Content-Type"];
  }

  // Send API requests through the same-origin Next.js proxy.
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const apiPath =
    normalizedEndpoint === "/api/v1" ||
    normalizedEndpoint.startsWith("/api/v1/")
      ? normalizedEndpoint
      : `/api/v1${normalizedEndpoint}`;

  const response = await fetch(apiPath, {
    ...options,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    if (!response.ok) {
      throw new Error("Something went wrong. Please try again.");
    }

    return {} as T;
  }

  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.message ||
        data.message ||
        "Something went wrong. Please try again.",
    );
  }

  return data;
}

export { API_URL };
