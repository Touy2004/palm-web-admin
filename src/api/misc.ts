import { PalmTemplate, ReportRow, ApiResponse, DashboardSummary } from './types';
import { apiClient } from './client';
import { API_CONFIG } from '@/config/api.config';
import { usersApi } from './users';

export const dashboardApi = {
  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    return apiClient<ApiResponse<DashboardSummary>>(API_CONFIG.ENDPOINTS.DASHBOARD.SUMMARY);
  }
};

export const templatesApi = {
  getTemplates: async (): Promise<ApiResponse<PalmTemplate[]>> => {
    // Because the backend doesn't have a global endpoint, we fetch users first,
    // then fetch the templates for each user and combine them.
    const usersRes = await usersApi.getUsers();
    const users = usersRes.data || [];
    
    const promises = users.map(u => 
      apiClient<ApiResponse<PalmTemplate[]>>(API_CONFIG.ENDPOINTS.USERS.PALM_TEMPLATES(u.id))
        .then(res => res.data || [])
        .catch(() => []) // ignore errors for users that might fail
    );
    
    const results = await Promise.all(promises);
    return {
      code: 200,
      status: "OK",
      message: "Combined templates retrieved",
      data: results.flat()
    };
  },
  deleteTemplate: async (userId: string, templateId: string): Promise<ApiResponse<null>> => {
    return apiClient<ApiResponse<null>>(API_CONFIG.ENDPOINTS.USERS.PALM_TEMPLATE_BY_ID(userId, templateId), {
      method: 'DELETE'
    });
  }
};


export const reportsApi = {
  getReports: async (month?: string, department?: string): Promise<ApiResponse<ReportRow[]>> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (department && department !== 'All departments') params.append('department', department);
    
    return apiClient<ApiResponse<ReportRow[]>>(`${API_CONFIG.ENDPOINTS.REPORTS.BASE}?${params.toString()}`);
  }
};
