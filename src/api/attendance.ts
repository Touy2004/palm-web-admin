import { AttendanceLog, AttendanceHistoryResponse, PaginatedResponse } from './types';
import { apiClient } from './client';
import { API_CONFIG } from '@/config/api.config';

export const attendanceApi = {
  getAllAttendance: async (page = 1, limit = 20, startDate?: string, endDate?: string): Promise<PaginatedResponse<AttendanceLog[]>> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate);

    return apiClient<PaginatedResponse<AttendanceLog[]>>(`${API_CONFIG.ENDPOINTS.ATTENDANCE.BASE}?${queryParams.toString()}`);
  },

  getUserAttendanceHistory: async (userId: string, startDate?: string, endDate?: string, page = 1, limit = 20): Promise<AttendanceHistoryResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate);

    return apiClient<AttendanceHistoryResponse>(`${API_CONFIG.ENDPOINTS.ATTENDANCE.USER_HISTORY(userId)}?${queryParams.toString()}`);
  }
};
