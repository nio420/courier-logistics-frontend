const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export type UserRole = "CUSTOMER" | "COURIER" | "ADMIN";

interface TokenPayload {
  role?: UserRole;
  exp?: number;
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function removeTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getUserRole(): UserRole | null {
  const token = getAccessToken();

  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    const decoded = JSON.parse(atob(base64)) as TokenPayload;

    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      removeTokens();
      return null;
    }

    if (
      decoded.role === "CUSTOMER" ||
      decoded.role === "COURIER" ||
      decoded.role === "ADMIN"
    ) {
      return decoded.role;
    }

    return null;
  } catch {
    return null;
  }
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "COURIER":
      return "/courier";
    case "CUSTOMER":
      return "/dashboard";
  }
}
