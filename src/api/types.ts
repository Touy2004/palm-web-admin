export interface User {
  id: string;
  employee_code: string;
  full_name: string;
  phone: string;
  email: string;
  department: string;
  role: string;
  status: string;
  palm_status?: string; // 'registered', 'unregistered'
  is_palm_registered?: boolean;
  password?: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  device_code: string;
  device_name: string;
  location_name: string;
  status: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceLog {
  id: string;
  user_id: string;
  attendance_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string; // 'present', 'late', 'absent', 'incomplete'
  device_name?: string;
  device_code?: string;
  check_in_score?: number;
  check_out_score?: number;
  work_duration_minutes?: number;
  work_duration_text?: string;
}

export interface AttendanceSummary {
  total_days: number;
  present_days: number;
  late_days: number;
  incomplete_days: number;
}

export interface DashboardSummary {
  total_users: number;
  total_devices: number;
  active_palm_templates: number;
  check_ins_today: number;
}

export interface ApiResponse<T = any> {
  code: number;
  status: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface AttendanceHistoryResponse extends PaginatedResponse<AttendanceLog[]> {
  user?: Partial<User>;
  summary?: AttendanceSummary;
}

export interface PalmTemplate {
  id: string;
  user_id: string;
  hand_side: string;
  model_version: string;
  embedding_dim: number;
  threshold: number;
  status: string;
  created_at: string;
}


export interface ReportRow {
  id: string;
  user_id: string;
  present: number;
  late: number;
  incomplete: number;
  absent: number;
  avgHours: string;
}
