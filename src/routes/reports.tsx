import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, PageHeader, Card, Avatar } from "@/components/admin-shell";
import { FileSpreadsheet, FileText, RefreshCw, Calendar, Loader2 } from "lucide-react";
import { useReportsViewModel } from "@/viewmodels/useReportsViewModel";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · PalmAdmin" }] }),
  component: ReportsPage,
});


function ReportsPage() {
  const vm = useReportsViewModel();

  return (
    <AdminShell>
      <PageHeader
        title="Reports"
        right={
          <div className="flex gap-2">
            <button onClick={vm.handleExportExcel} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition">
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
            </button>
            <button onClick={vm.handleExportPDF} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              <FileText className="h-4 w-4" /> Export PDF
            </button>
          </div>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="!p-5">
          <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
            <div className="w-full sm:w-auto">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Month</div>
              <input
                type="month"
                value={vm.month}
                onChange={(e) => vm.setMonth(e.target.value)}
                className="mt-1.5 flex h-10 w-full sm:w-auto items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-sm"
              />
            </div>
            <div className="w-full sm:w-auto">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Department</div>
              <select 
                value={vm.department} 
                onChange={(e) => vm.setDepartment(e.target.value)}
                className="mt-1.5 h-10 w-full sm:w-auto rounded-lg border border-border bg-card px-3 text-sm"
              >
                <option value="All departments">All departments</option>
                {vm.availableDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => vm.handleGenerate()}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" /> Generate
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Working days", value: vm.summaryData.workingDays.toString(), sub: "" },
            { label: "Avg attendance", value: vm.summaryData.avgAttendance, sub: vm.department },
            { label: "Total late days", value: vm.summaryData.totalLate.toString(), sub: "" },
            { label: "Incomplete", value: vm.summaryData.totalIncomplete.toString(), sub: "" },
          ].map((s) => (
            <Card key={s.label}>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="mt-3 text-4xl font-semibold text-foreground">{s.value}</div>
              {s.sub && <div className="mt-6 text-xs text-muted-foreground">{s.sub}</div>}
            </Card>
          ))}
        </div>

        <Card className="!p-0">
          <div className="px-6 py-5">
            <h2 className="text-base font-semibold text-foreground">Monthly summary — {vm.month}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-y border-border bg-muted/30 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="py-3 font-medium">Emp. code</th>
                  <th className="py-3 font-medium">Department</th>
                  <th className="py-3 font-medium">Present</th>
                  <th className="py-3 font-medium">Late</th>
                  <th className="py-3 font-medium">Incomplete</th>
                  <th className="py-3 font-medium">Absent</th>
                  <th className="px-6 py-3 font-medium">Avg hours</th>
                </tr>
              </thead>
              <tbody>
                {vm.isLoadingReports ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Loading reports...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  vm.reportsList.map((r) => {
                    const user = vm.usersMap.get(r.user_id);
                    const name = user?.full_name || 'Unknown';
                    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
                    return (
                      <tr key={r.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar initials={initials} />
                            <span className="font-medium text-foreground">{name}</span>
                          </div>
                        </td>
                        <td className="py-4 font-mono text-foreground">{user?.employee_code || '—'}</td>
                        <td className="py-4 text-foreground">{user?.department || '—'}</td>
                        <td className="py-4 font-mono text-primary">{r.present}</td>
                        <td className="py-4 font-mono text-warning-foreground">{r.late}</td>
                        <td className="py-4 font-mono text-warning-foreground">{r.incomplete}</td>
                        <td className="py-4 font-mono text-foreground">{r.absent}</td>
                        <td className="px-6 py-4 text-muted-foreground">{r.avgHours}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
