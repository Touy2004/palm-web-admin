import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, PageHeader, Card } from "@/components/admin-shell";
import { useAttendanceViewModel } from "@/viewmodels/useAttendanceViewModel";
import { AttendanceSearch } from "@/components/attendance/AttendanceSearch";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { useTranslation } from "@/hooks/useTranslation";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance · PalmAdmin" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const vm = useAttendanceViewModel();
  const { t } = useTranslation();

  return (
    <AdminShell>
      <PageHeader title={t('attendance.title')} />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="!p-4">
          <AttendanceSearch 
            searchQuery={vm.searchQuery}
            setSearchQuery={vm.setSearchQuery}
            startDate={vm.startDate}
            setStartDate={vm.setStartDate}
            endDate={vm.endDate}
            setEndDate={vm.setEndDate}
            handleSearch={vm.handleSearch}
          />
        </Card>

        {vm.selectedUser && vm.summary && (
          <Card className="!p-0">
            <AttendanceStats selectedUser={vm.selectedUser} summary={vm.summary} />
          </Card>
        )}

        <Card className="!p-0">
          <AttendanceHeader 
            selectedUser={vm.selectedUser}
            handleExportPDF={vm.handleExportPDF}
            handleExportExcel={vm.handleExportExcel}
          />
          <AttendanceTable 
            isLoading={vm.isLoading}
            logs={vm.logs}
            totalRecords={vm.totalRecords}
          />
        </Card>
      </div>
    </AdminShell>
  );
}
