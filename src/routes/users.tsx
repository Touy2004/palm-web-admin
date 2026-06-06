import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, PageHeader, Card, StatusPill, Avatar, statusKind } from "@/components/admin-shell";
import { Search, Plus, Pencil, Loader2, PlayCircle, PauseCircle, Trash, AlertTriangle } from "lucide-react";
import { useUsersViewModel, usersTabs } from "@/viewmodels/useUsersViewModel";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { EditUserModal } from "@/components/users/EditUserModal";
import { useState } from "react";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users · PalmAdmin" }] }),
  component: UsersPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center">
      <p className="text-danger font-medium">Error loading users page</p>
      <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
    </div>
  ),
});

function UsersPage() {
  const vm = useUsersViewModel();
  const [searchInput, setSearchInput] = useState(vm.searchQuery);

  return (
    <AdminShell>
      <PageHeader
        title="User management"
        right={
          <button 
            onClick={() => vm.setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
            <Plus className="h-4 w-4" /> Create user
          </button>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <div className="flex gap-1 rounded-full bg-card p-1 w-fit border border-border">
          {usersTabs.map((t) => (
            <button
              key={t}
              onClick={() => vm.setTab(t)}
              className={`rounded-full px-5 py-2 text-sm transition ${
                vm.tab === t ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Card className="!p-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              vm.setSearchQuery(searchInput);
            }} 
            className="flex flex-col sm:flex-row items-center gap-3 p-5"
          >
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search by Emp. code or name "
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-10 w-full rounded-full border border-border bg-muted/40 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button 
              type="submit"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </form>
          <div className="overflow-x-auto">
            {vm.isError ? (
              <div className="flex flex-col items-center justify-center p-12 text-danger">
                <AlertTriangle className="h-8 w-8 mb-4 opacity-80" />
                <p>Failed to load users.</p>
                <p className="text-xs text-muted-foreground mt-2">{vm.error?.message}</p>
              </div>
            ) : vm.isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading users...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-y border-border bg-muted/30 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Employee</th>
                    <th className="py-3 font-medium">Emp. code</th>
                    <th className="py-3 font-medium">Department</th>
                    <th className="py-3 font-medium">Phone</th>
                    <th className="py-3 font-medium">Role</th>
                    <th className="py-3 font-medium">Palm</th>
                    <th className="py-3 font-medium">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {vm.paginatedUsers.map((u) => {
                    if (!u) return null;
                    const nameStr = String(u.full_name || (u as any).name || 'Unknown');
                    const initials = nameStr.split(' ').map((n: string) => n[0] || '').join('').substring(0, 2);
                    return (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={initials} />
                          <div>
                            <div className="font-medium text-foreground">{nameStr}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-mono text-foreground">{u.employee_code}</td>
                      <td className="py-4 text-foreground">{u.department || '—'}</td>
                      <td className="py-4 font-mono text-muted-foreground">{u.phone}</td>
                      <td className="py-4 text-muted-foreground lowercase">{u.role?.toLowerCase()}</td>
                      <td className="py-4">
                        <StatusPill kind={(u.is_palm_registered || u.palm_status === "registered") ? "success" : "neutral"}>
                          {(u.is_palm_registered || u.palm_status === "registered") ? "registered" : "unregistered"}
                        </StatusPill>
                      </td>
                      <td className="py-4">
                        <StatusPill kind={statusKind(u.status || "neutral")}>{u.status || "neutral"}</StatusPill>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button 
                          onClick={() => vm.setEditingUser(u)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        {u.status === "active" ? (
                          <button 
                            onClick={() => vm.handleToggleStatus(u)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                            <PauseCircle className="h-3.5 w-3.5" /> Disable
                          </button>
                        ) : (
                          <button 
                            onClick={() => vm.handleToggleStatus(u)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                            <PlayCircle className="h-3.5 w-3.5" /> Enable
                          </button>
                        )}
                        <button 
                          onClick={() => vm.handleDeleteUser(u.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-danger/20 text-danger px-3 py-1.5 text-xs font-medium hover:bg-danger/10">
                          <Trash className="h-3.5 w-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 p-5 text-sm text-muted-foreground">
            <span>{vm.filteredUsers.length} total users</span>
            {vm.totalPages > 1 && Array.from({ length: vm.totalPages }, (_, i) => i + 1).map((p) => (
              <button 
                key={p} 
                onClick={() => vm.setCurrentPage(p)}
                className={`h-8 min-w-8 rounded-lg border border-border px-2.5 transition ${
                  p === vm.currentPage 
                    ? "bg-foreground text-background" 
                    : "hover:bg-muted text-foreground"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <CreateUserModal
        isOpen={vm.isCreateOpen}
        onClose={() => vm.setIsCreateOpen(false)}
        onSubmit={vm.handleCreateSubmit}
        isCreating={vm.isCreating}
      />

      <EditUserModal
        user={vm.editingUser}
        onClose={() => vm.setEditingUser(null)}
        onSubmit={vm.handleEditSubmit}
        isEditing={vm.isEditing}
      />
    </AdminShell>
  );
}
