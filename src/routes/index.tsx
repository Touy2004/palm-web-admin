import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, PageHeader, Card, StatusPill, Avatar, statusKind } from "@/components/admin-shell";
import { Users, CheckCircle2, Smartphone, Fingerprint, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard · PalmAdmin" }] }),
  component: Dashboard,
});

const statIcons: Record<string, any> = {
  "Total employees": Users,
  "Check-ins today": CheckCircle2,
  "Total devices": Smartphone,
  "Palm registered": Fingerprint,
};

function Dashboard() {
  const vm = useDashboardViewModel();

  return (
    <AdminShell>
      <PageHeader
        title="Dashboard"
        right={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {vm.realStats.map((s) => {
            const Icon = statIcons[s.label];
            return (
              <Card key={s.label} className="relative overflow-hidden transition-all hover:shadow-sm">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>
                  {s.label}
                </div>
                <div className={`mt-4 text-4xl font-semibold tracking-tight ${s.tone}`}>{s.value}</div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="text-base font-semibold text-foreground">Attendance this week</h2>
            <div className="mt-6 space-y-4">
              {vm.realWeek.map((w) => (
                <div key={w.day} className="flex items-center gap-4">
                  <div className="w-10 text-sm text-muted-foreground">{w.day}</div>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${w.pct}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-sm text-muted-foreground">
                    {w.value ?? "—"}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Today's status breakdown</h2>
            <div className="mt-6 space-y-4">
              {vm.realStatusBreakdown.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                    <span className="text-sm text-foreground">{s.label}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="!p-0">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-base font-semibold text-foreground">Recent check-ins</h2>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-y border-border bg-muted/30 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="py-3 font-medium">Check-in</th>
                  <th className="py-3 font-medium">Check-out</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Device</th>
                </tr>
              </thead>
              <tbody>
                {vm.isLoadingAttendance ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Loading recent check-ins...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  vm.recentCheckInsData.map((r) => {
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
                        <td className="py-4 font-mono text-foreground">{r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                        <td className="py-4 font-mono text-muted-foreground">{r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                        <td className="py-4">
                          <StatusPill kind={statusKind(r.status)}>{r.status}</StatusPill>
                        </td>
                        <td className="py-4 font-mono text-foreground">{r.check_in_score || '—'}</td>
                        <td className="px-6 py-4 text-muted-foreground">{r.device_name || '—'} {r.device_code ? `(${r.device_code})` : ''}</td>
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
