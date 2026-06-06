import { User, Device, AttendanceLog, PalmTemplate, ReportRow } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    employee_code: 'EMP001',
    full_name: 'Kai Song',
    phone: '02011111112',
    email: 'kai@example.com',
    department: 'Engineering',
    role: 'employee',
    status: 'active',
    palm_status: 'registered',
    created_at: '2026-05-01T10:00:00Z',
    updated_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 'user-2',
    employee_code: 'EMP002',
    full_name: 'Jane Doe',
    phone: '02022222222',
    email: 'jane@example.com',
    department: 'HR',
    role: 'admin',
    status: 'active',
    palm_status: 'registered',
    created_at: '2026-05-02T10:00:00Z',
    updated_at: '2026-05-02T10:00:00Z',
  },
  {
    id: 'user-3',
    employee_code: 'EMP003',
    full_name: 'John Smith',
    phone: '02033333333',
    email: 'john@example.com',
    department: 'Marketing',
    role: 'employee',
    status: 'inactive',
    palm_status: 'unregistered',
    created_at: '2026-05-03T10:00:00Z',
    updated_at: '2026-05-03T10:00:00Z',
  },
];

export const mockDevices: Device[] = [
  {
    id: 'dev-1',
    device_code: 'PALM-DEVICE-001',
    device_name: 'Front Door',
    location_name: 'Main Entrance',
    status: 'active',
    last_seen_at: '2026-06-03T08:15:00Z',
    created_at: '2026-05-01T09:00:00Z',
    updated_at: '2026-05-01T09:00:00Z',
  },
  {
    id: 'dev-2',
    device_code: 'PALM-DEVICE-002',
    device_name: 'Back Door',
    location_name: 'Staff Entrance',
    status: 'active',
    last_seen_at: '2026-06-03T08:20:00Z',
    created_at: '2026-05-02T09:00:00Z',
    updated_at: '2026-05-02T09:00:00Z',
  },
];

export const mockAttendanceLogs: AttendanceLog[] = [
  {
    id: 'att-1',
    user_id: 'user-1',
    attendance_date: '2026-06-03',
    check_in_time: '2026-06-03T08:25:00Z',
    check_out_time: '2026-06-03T17:36:00Z',
    status: 'present',
    device_name: 'Front Door',
    check_in_score: 0.87341,
    check_out_score: 0.86122,
    work_duration_minutes: 551,
    work_duration_text: '9h 11m',
  },
  {
    id: 'att-2',
    user_id: 'user-1',
    attendance_date: '2026-06-02',
    check_in_time: '2026-06-02T08:51:00Z',
    check_out_time: '2026-06-02T17:30:00Z',
    status: 'late',
    device_name: 'Front Door',
    check_in_score: 0.88011,
    check_out_score: 0.87522,
    work_duration_minutes: 519,
    work_duration_text: '8h 39m',
  },
  {
    id: 'att-3',
    user_id: 'user-1',
    attendance_date: '2026-06-01',
    check_in_time: '2026-06-01T08:30:00Z',
    check_out_time: null,
    status: 'incomplete',
    device_name: 'Front Door',
    check_in_score: 0.89123,
  },
];

export const mockPalmTemplates: PalmTemplate[] = [
  { id: "tmpl-1", user_id: "user-1", hand_side: "Right", model_version: "mobilenetv3-v1", embedding_dim: 128, threshold: 0.820, status: "active", created_at: "2026-06-01T00:00:00Z" },
  { id: "tmpl-2", user_id: "user-2", hand_side: "Left", model_version: "mobilenetv3-v1", embedding_dim: 128, threshold: 0.820, status: "active", created_at: "2026-05-28T00:00:00Z" },
  { id: "tmpl-3", user_id: "user-3", hand_side: "Right", model_version: "mobilenetv3-v1", embedding_dim: 128, threshold: 0.820, status: "revoked", created_at: "2026-04-15T00:00:00Z" },
];



export const mockReportRows: ReportRow[] = [
  { id: "rep-1", user_id: "user-1", present: 18, late: 2, incomplete: 1, absent: 0, avgHours: "8h 51m" },
  { id: "rep-2", user_id: "user-2", present: 20, late: 0, incomplete: 0, absent: 0, avgHours: "9h 04m" },
  { id: "rep-3", user_id: "user-3", present: 15, late: 4, incomplete: 1, absent: 1, avgHours: "8h 22m" },
];
