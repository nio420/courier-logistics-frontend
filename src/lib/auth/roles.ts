import type { UserRole } from "@/types/auth";

export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  COURIER: "COURIER",
  ADMIN: "ADMIN",
} as const;

export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}
