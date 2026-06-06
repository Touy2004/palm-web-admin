import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface AttendanceStatsProps {
  selectedUser: any;
  summary: any;
}

export function AttendanceStats({ selectedUser, summary }: AttendanceStatsProps) {
  const { t } = useTranslation();
  if (!selectedUser || !summary) return null;

  return (
    <div className="grid grid-cols-2 gap-6 px-6 py-5 sm:grid-cols-5">
      <Stat label="SELECTED EMPLOYEE" value={`${selectedUser.full_name} — ${selectedUser.employee_code}`} />
      <Stat label="DATE RANGE" value={`${summary.total_days} days`} />
      <Stat label={t('attendance.stats.totalPresent')} value={`${summary.present_days} days`} tone="text-primary" />
      <Stat label={t('attendance.stats.totalLate')} value={`${summary.late_days} days`} tone="text-warning-foreground" />
      <Stat label={t('attendance.stats.totalIncomplete')} value={`${summary.incomplete_days} days`} tone="text-warning-foreground" />
    </div>
  );
}

function Stat({ label, value, tone = "text-foreground" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1.5 text-base font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
