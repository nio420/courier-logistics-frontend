// import { apiClient } from "@/lib/api/client";
// import type {
//   AuthResponse,
//   LoginInput,
//   RegisterInput,
//   User,
// } from "@/types/auth";

// export const authService = {
//   async login(data: LoginInput): Promise<AuthResponse> {
//     return apiClient<AuthResponse>("/auth/login", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   },

//   async register(data: RegisterInput): Promise<AuthResponse> {
//     return apiClient<AuthResponse>("/auth/register", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   },

//   async getMe(): Promise<User> {
//     const response = await apiClient<AuthResponse>("/auth/me");
//     return response.data.user;
//   },

//   async logout(): Promise<void> {
//     await apiClient("/auth/logout", {
//       method: "POST",
//     });
//   },
// };
