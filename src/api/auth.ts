import { apiClient } from "./client";
import { User, ApiResponse } from "./types";
import { API_CONFIG } from "@/config/api.config";

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  login: async (phone: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    // Note: Documentation says /auth/login
    // And it returns { code, status, message, data: { user, access_token, refresh_token } }
    return apiClient<ApiResponse<LoginResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    });
  },

  refresh: async (refresh_token: string): Promise<ApiResponse<{ access_token: string, refresh_token: string }>> => {
    return apiClient<ApiResponse<{ access_token: string, refresh_token: string }>>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    });
  },

  getMe: async (): Promise<ApiResponse<{user: User}>> => {
    return apiClient<ApiResponse<{user: User}>>(API_CONFIG.ENDPOINTS.AUTH.ME);
  }
};
