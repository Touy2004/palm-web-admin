import { Device, ApiResponse } from './types';
import { apiClient } from './client';
import { API_CONFIG } from '@/config/api.config';

export const devicesApi = {
  getDevices: async (): Promise<ApiResponse<Device[]>> => {
    return apiClient<ApiResponse<Device[]>>(API_CONFIG.ENDPOINTS.DEVICES.BASE);
  },

  createDevice: async (deviceData: Partial<Device>): Promise<ApiResponse<{ id: string, device_code: string }>> => {
    return apiClient<ApiResponse<{ id: string, device_code: string }>>(API_CONFIG.ENDPOINTS.DEVICES.BASE, {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  },

  updateDevice: async (id: string, deviceData: Partial<Device>): Promise<ApiResponse<{ id: string }>> => {
    return apiClient<ApiResponse<{ id: string }>>(API_CONFIG.ENDPOINTS.DEVICES.BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(deviceData),
    });
  },

  deleteDevice: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient<ApiResponse<null>>(API_CONFIG.ENDPOINTS.DEVICES.BY_ID(id), {
      method: 'DELETE',
    });
  }
};
