export const API_CONFIG = {
  BASE_URL: "/api/v1",
  ENDPOINTS: {
    USERS: {
      BASE: "/admin/users",
      BY_ID: (id: string) => `/admin/users/${id}`,
      PALM_TEMPLATES: (id: string) => `/admin/users/${id}/palm-templates`,
      PALM_TEMPLATE_BY_ID: (userId: string, templateId: string) => `/admin/users/${userId}/palm-templates/${templateId}`,
    },
    ATTENDANCE: {
      BASE: "/admin/attendance",
      USER_HISTORY: (userId: string) => `/admin/attendance/users/${userId}/history`,
    },
    DEVICES: {
      BASE: "/admin/devices",
      BY_ID: (id: string) => `/admin/devices/${id}`,
    },
    DASHBOARD: {
      SUMMARY: "/admin/dashboard/summary",
    },
    REPORTS: {
      BASE: "/admin/reports",
    },
    AUTH: {
      ME: "/me",
    }
  }
};
