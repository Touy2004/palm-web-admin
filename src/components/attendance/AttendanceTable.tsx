import React from "react";
import { Loader2 } from "lucide-react";
import { StatusPill, statusKind } from "@/components/admin-shell";
import { calculateWorkHours } from "@/viewmodels/useAttendanceViewModel";
import { useTranslation } from "@/hooks/useTranslation";

interface AttendanceTableProps {
  isLoading: boolean;
  logs: any[];
  totalRecords: number;
}

export function AttendanceTable({ isLoading, logs, totalRecords }: AttendanceTableProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-border bg-muted/30 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">{t('attendance.table.date')}</th>
              <th className="py-3 font-medium">{t('attendance.table.checkIn')}</th>
              <th className="py-3 font-medium">{t('attendance.table.checkOut')}</th>
              <th className="py-3 font-medium">{t('attendance.table.workHours')}</th>
              <th className="py-3 font-medium">{t('attendance.table.status')}</th>
              <th className="py-3 font-medium">{t('attendance.table.device')}</th>
              <th className="py-3 font-medium">{t('attendance.table.inScore')}</th>
              <th className="px-6 py-3 font-medium">{t('attendance.table.outScore')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>{t('common.loading')}</p>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground">
                  <p>{t('common.noRecords')}</p>
                </td>
              </tr>
            ) : (
              logs.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 font-medium text-foreground">{r.attendance_date}</td>
                  <td className="py-4 font-mono text-foreground">{r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                  <td className="py-4 font-mono text-foreground">{r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                  <td className="py-4 text-muted-foreground">{r.work_duration_text || calculateWorkHours(r.check_in_time, r.check_out_time)}</td>
                  <td className="py-4">
                    <StatusPill kind={statusKind(r.status)}>{t(`common.status.${r.status}`) || r.status}</StatusPill>
                  </td>
                  <td className="py-4 text-muted-foreground">{r.device_name || '—'} {r.device_code ? `(${r.device_code})` : ''}</td>
                  <td className="py-4 font-mono text-foreground">{r.check_in_score || '—'}</td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">{r.check_out_score || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2 p-5 text-sm text-muted-foreground">
        <span>{totalRecords} records</span>
        <button className="h-8 min-w-8 rounded-lg border border-border bg-foreground px-2.5 text-background">1</button>
      </div>
    </>
  );
}
