// Mock data for the Palm Admin web UI

export type UserStatus = "active" | "inactive";
export type PalmStatus = "registered" | "not enrolled";
export type AttendanceStatus = "present" | "late" | "absent" | "incomplete";

export interface AdminUser {
  id: string;
  initials: string;
  name: string;
  email: string;
  code: string;
  department: string;
  phone: string;
  palm: PalmStatus;
  status: UserStatus;
}

export const users: AdminUser[] = [
  { id: "1", initials: "KS", name: "Kai Song", email: "kai@example.com", code: "EMP001", department: "Engineering", phone: "020-111-2233", palm: "registered", status: "active" },
  { id: "2", initials: "AL", name: "Ana Lim", email: "ana@example.com", code: "EMP002", department: "HR", phone: "020-222-3344", palm: "registered", status: "active" },
  { id: "3", initials: "DP", name: "Dev Patel", email: "dev@example.com", code: "EMP003", department: "Engineering", phone: "020-333-4455", palm: "registered", status: "active" },
  { id: "4", initials: "JW", name: "Jess Wu", email: "jess@example.com", code: "EMP004", department: "Finance", phone: "020-444-5566", palm: "registered", status: "active" },
  { id: "5", initials: "MT", name: "Max Torres", email: "max@example.com", code: "EMP005", department: "HR", phone: "020-555-6677", palm: "not enrolled", status: "active" },
  { id: "6", initials: "NR", name: "Nina Roy", email: "nina@example.com", code: "EMP006", department: "Finance", phone: "020-666-7788", palm: "registered", status: "inactive" },
  { id: "7", initials: "SL", name: "Sam Lee", email: "sam@example.com", code: "EMP007", department: "Engineering", phone: "020-777-8899", palm: "registered", status: "active" },
  { id: "8", initials: "BK", name: "Ben Kim", email: "ben@example.com", code: "EMP008", department: "Marketing", phone: "020-888-9900", palm: "not enrolled", status: "active" },
];

export interface CheckIn {
  initials: string;
  name: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  score: string;
  device: string;
}

export const recentCheckIns: CheckIn[] = [
  { initials: "KS", name: "Kai Song", checkIn: "08:25", checkOut: "17:36", status: "present", score: "0.873", device: "Front Door" },
  { initials: "AL", name: "Ana Lim", checkIn: "08:18", checkOut: "—", status: "present", score: "0.901", device: "Front Door" },
  { initials: "DP", name: "Dev Patel", checkIn: "08:47", checkOut: "—", status: "late", score: "0.862", device: "Front Door" },
  { initials: "JW", name: "Jess Wu", checkIn: "08:22", checkOut: "17:30", status: "present", score: "0.889", device: "Side Entry" },
  { initials: "MT", name: "Max Torres", checkIn: "—", checkOut: "—", status: "absent", score: "—", device: "—" },
];

export interface AttendanceRow {
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: AttendanceStatus;
  device: string;
  inScore: string;
  outScore: string;
}

export const attendanceRows: AttendanceRow[] = [
  { date: "03 Jun", checkIn: "08:25", checkOut: "17:36", hours: "9h 11m", status: "present", device: "Front Door", inScore: "0.873", outScore: "0.861" },
  { date: "02 Jun", checkIn: "08:51", checkOut: "17:30", hours: "8h 39m", status: "late", device: "Front Door", inScore: "0.862", outScore: "0.877" },
  { date: "01 Jun", checkIn: "08:30", checkOut: "—", hours: "—", status: "incomplete", device: "Front Door", inScore: "0.891", outScore: "—" },
  { date: "31 May", checkIn: "08:22", checkOut: "17:28", hours: "9h 06m", status: "present", device: "Side Entry", inScore: "0.889", outScore: "0.901" },
  { date: "30 May", checkIn: "08:19", checkOut: "17:41", hours: "9h 22m", status: "present", device: "Front Door", inScore: "0.912", outScore: "0.887" },
];

export interface Device {
  id: string;
  name: string;
  code: string;
  location: string;
  lastSeen: string;
  status: "active" | "inactive";
}

export const devices: Device[] = [
  { id: "1", name: "Front Door", code: "PALM-DEVICE-001", location: "Main Entrance", lastSeen: "2 min ago", status: "active" },
  { id: "2", name: "Side Entry", code: "PALM-DEVICE-002", location: "Side Gate", lastSeen: "5 min ago", status: "active" },
  { id: "3", name: "Server Room", code: "PALM-DEVICE-003", location: "IT Floor", lastSeen: "2 days ago", status: "inactive" },
];

export interface PalmTemplate {
  initials: string;
  name: string;
  hand: "Left" | "Right";
  model: string;
  dim: number;
  threshold: string;
  status: "active" | "revoked";
  registered: string;
}

export const palmTemplates: PalmTemplate[] = [
  { initials: "KS", name: "Kai Song", hand: "Right", model: "mobilenetv3-v1", dim: 128, threshold: "0.820", status: "active", registered: "01 Jun 2026" },
  { initials: "AL", name: "Ana Lim", hand: "Left", model: "mobilenetv3-v1", dim: 128, threshold: "0.820", status: "active", registered: "28 May 2026" },
  { initials: "DP", name: "Dev Patel", hand: "Right", model: "mobilenetv3-v1", dim: 128, threshold: "0.820", status: "active", registered: "30 May 2026" },
  { initials: "JW", name: "Jess Wu", hand: "Right", model: "mobilenetv3-v1", dim: 128, threshold: "0.820", status: "active", registered: "29 May 2026" },
  { initials: "NR", name: "Nina Roy", hand: "Right", model: "mobilenetv3-v1", dim: 128, threshold: "0.820", status: "revoked", registered: "15 Apr 2026" },
];

export interface FailedAttempt {
  time: string;
  matchedUser: string;
  action: "identify" | "check_in" | "check_out";
  score: string;
  liveness: "passed" | "failed";
  reason: string;
  device: string;
}

export const failedAttempts: FailedAttempt[] = [
  { time: "Today 08:31:22", matchedUser: "Unknown", action: "identify", score: "0.612", liveness: "passed", reason: "Score below threshold", device: "Front Door" },
  { time: "Today 08:29:10", matchedUser: "Dev Patel", action: "check_in", score: "0.741", liveness: "passed", reason: "Score below threshold", device: "Front Door" },
  { time: "Today 08:15:04", matchedUser: "Unknown", action: "identify", score: "—", liveness: "failed", reason: "Liveness check failed", device: "Front Door" },
  { time: "Today 07:58:33", matchedUser: "Unknown", action: "identify", score: "0.580", liveness: "passed", reason: "Score below threshold", device: "Side Entry" },
  { time: "Today 07:44:11", matchedUser: "Kai Song", action: "check_in", score: "0.799", liveness: "passed", reason: "Score below threshold", device: "Front Door" },
];

export interface ReportRow {
  initials: string;
  name: string;
  code: string;
  department: string;
  present: number;
  late: number;
  incomplete: number;
  absent: number;
  avgHours: string;
}

export const reportRows: ReportRow[] = [
  { initials: "KS", name: "Kai Song", code: "EMP001", department: "Engineering", present: 18, late: 2, incomplete: 1, absent: 0, avgHours: "8h 51m" },
  { initials: "AL", name: "Ana Lim", code: "EMP002", department: "HR", present: 20, late: 0, incomplete: 0, absent: 0, avgHours: "9h 04m" },
  { initials: "DP", name: "Dev Patel", code: "EMP003", department: "Engineering", present: 15, late: 4, incomplete: 1, absent: 1, avgHours: "8h 22m" },
  { initials: "JW", name: "Jess Wu", code: "EMP004", department: "Finance", present: 19, late: 1, incomplete: 0, absent: 0, avgHours: "8h 48m" },
  { initials: "MT", name: "Max Torres", code: "EMP005", department: "HR", present: 16, late: 2, incomplete: 2, absent: 1, avgHours: "8h 10m" },
];
