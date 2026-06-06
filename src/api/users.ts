import { User, ApiResponse } from './types';
import { apiClient } from './client';
import { API_CONFIG } from '@/config/api.config';

export const usersApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiClient<ApiResponse<User[]>>(API_CONFIG.ENDPOINTS.USERS.BASE);
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient<ApiResponse<User>>(API_CONFIG.ENDPOINTS.USERS.BY_ID(id));
  },

  createUser: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient<ApiResponse<User>>(API_CONFIG.ENDPOINTS.USERS.BASE, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<ApiResponse<{ id: string, department?: string }>> => {
    return apiClient<ApiResponse<{ id: string, department?: string }>>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient<ApiResponse<null>>(API_CONFIG.ENDPOINTS.USERS.BY_ID(id), {
      method: 'DELETE',
    });
  },

  searchUsers: async (query: string): Promise<ApiResponse<User[]>> => {
    return apiClient<ApiResponse<User[]>>(`/admin/users/search?q=${encodeURIComponent(query)}`);
  }
};
