import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, PageHeader, Card, StatusPill, statusKind } from "@/components/admin-shell";
import { Plus, Monitor, MapPin, Clock, Pencil, PauseCircle, PlayCircle, Loader2 } from "lucide-react";
import { useDevicesViewModel } from "@/viewmodels/useDevicesViewModel";
import { CreateDeviceModal } from "@/components/devices/CreateDeviceModal";
import { EditDeviceModal } from "@/components/devices/EditDeviceModal";

export const Route = createFileRoute("/devices")({
  head: () => ({ meta: [{ title: "Devices · PalmAdmin" }] }),
  component: DevicesPage,
});

function DevicesPage() {
  const vm = useDevicesViewModel();

  return (
    <AdminShell>
      <PageHeader
        title="Devices"
        right={
          <button onClick={() => vm.setIsCreateOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Add device
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-5 p-4 md:p-8 md:grid-cols-2 xl:grid-cols-3">
        {vm.isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading devices...</p>
          </div>
        ) : (
          vm.devicesList.map((d) => (
            <Card key={d.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{d.device_name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{d.device_code}</div>
                  </div>
                </div>
                <StatusPill kind={statusKind(d.status)}>{d.status}</StatusPill>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {d.location_name}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Last seen {d.last_seen_at ? new Date(d.last_seen_at).toLocaleString() : '—'}
                </div>
              </div>

              <div className="mt-5 flex gap-2 border-t border-border pt-4">
                <button onClick={() => vm.setEditingDevice(d)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                {d.status === "active" ? (
                  <button onClick={() => vm.handleToggleStatus(d)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                    <PauseCircle className="h-3.5 w-3.5" /> Disable
                  </button>
                ) : (
                  <button onClick={() => vm.handleToggleStatus(d)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                    <PlayCircle className="h-3.5 w-3.5" /> Enable
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <CreateDeviceModal
        isOpen={vm.isCreateOpen}
        onClose={() => vm.setIsCreateOpen(false)}
        onSubmit={vm.handleCreateSubmit}
        isCreating={vm.isCreating}
      />

      <EditDeviceModal
        device={vm.editingDevice}
        onClose={() => vm.setEditingDevice(null)}
        onSubmit={vm.handleEditSubmit}
        isEditing={vm.isEditing}
      />
    </AdminShell>
  );
}
