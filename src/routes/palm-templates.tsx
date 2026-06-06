import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, PageHeader, Card, StatusPill, Avatar, statusKind } from "@/components/admin-shell";
import { Search, Loader2 } from "lucide-react";
import { usePalmTemplatesViewModel } from "@/viewmodels/usePalmTemplatesViewModel";

export const Route = createFileRoute("/palm-templates")({
  head: () => ({ meta: [{ title: "Palm templates · PalmAdmin" }] }),
  component: PalmTemplatesPage,
});

function PalmTemplatesPage() {
  const vm = usePalmTemplatesViewModel();

  return (
    <AdminShell>
      <PageHeader title="Palm templates" />
      <div className="p-4 md:p-8">
        <Card className="!p-0">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-5">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search employee…"
                className="h-10 w-full sm:max-w-xs rounded-full border border-border bg-muted/40 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select className="h-10 w-full sm:w-auto rounded-lg border border-border bg-card px-3 text-sm">
              <option>All status</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-y border-border bg-muted/30 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="py-3 font-medium">Hand</th>
                  <th className="py-3 font-medium">Model</th>
                  <th className="py-3 font-medium">Dim</th>
                  <th className="py-3 font-medium">Threshold</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Registered</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {vm.isLoadingTemplates ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Loading templates...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  vm.templatesList.map((t) => {
                    const user = vm.usersMap.get(t.user_id);
                    const name = user?.full_name || 'Unknown';
                    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
                    return (
                      <tr key={t.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar initials={initials} />
                            <span className="font-medium text-foreground">{name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-foreground">{t.hand_side}</td>
                        <td className="py-4 font-mono text-foreground">{t.model_version}</td>
                        <td className="py-4 font-mono text-muted-foreground">{t.embedding_dim}</td>
                        <td className="py-4 font-mono text-foreground">{t.threshold.toFixed(3)}</td>
                        <td className="py-4">
                          <StatusPill kind={statusKind(t.status)}>{t.status}</StatusPill>
                        </td>
                        <td className="py-4 text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => t.status === "active" && vm.handleRevokeTemplate(t.user_id, t.id)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                          >
                            {t.status === "active" ? "Revoke" : "Restore"}
                          </button>
                        </td>
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
