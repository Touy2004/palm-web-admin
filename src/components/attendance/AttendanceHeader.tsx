import React from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface AttendanceHeaderProps {
  selectedUser: any;
  handleExportPDF: () => void;
  handleExportExcel: () => void;
}

export function AttendanceHeader({ selectedUser, handleExportPDF, handleExportExcel }: AttendanceHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5">
      <div>
        <h2 className="text-base font-semibold text-foreground flex flex-col sm:flex-row sm:items-center">
          {selectedUser ? selectedUser.full_name : t('attendance.globalAttendance')} 
          {selectedUser && <span className="sm:ml-2 text-sm font-normal text-muted-foreground mt-1 sm:mt-0">{selectedUser.employee_code} · {selectedUser.department || 'Unknown Dept'}</span>}
        </h2>
      </div>
      <div className="flex gap-2">
        <button onClick={handleExportPDF} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition">
          <FileText className="h-3.5 w-3.5" /> {t('common.exportPDF')}
        </button>
        <button onClick={handleExportExcel} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition">
          <FileSpreadsheet className="h-3.5 w-3.5" /> {t('common.exportExcel')}
        </button>
      </div>
    </div>
  );
}
