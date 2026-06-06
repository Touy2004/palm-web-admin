import { Card } from "@/components/admin-shell";
import { X, Loader2 } from "lucide-react";
import { Device } from "@/api/types";
import { useEffect, useState } from "react";

interface Props {
  device: Device | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
}

export function EditDeviceModal({ device, onClose, onSubmit, isEditing }: Props) {
  // Use state to seed default values without making them strictly controlled
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    if (device) {
      setKey(prev => prev + 1);
    }
  }, [device]);

  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <Card className="w-full max-w-md !p-0 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between border-b border-border bg-card/50 px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">Edit device</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted text-muted-foreground transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form key={key} onSubmit={onSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Device name</label>
            <input required name="device_name" defaultValue={device.device_name} placeholder="E.g. Main Entrance" className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Device code</label>
            <input required name="device_code" defaultValue={device.device_code} placeholder="E.g. DEV-001" className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <input required name="location_name" defaultValue={device.location_name} placeholder="E.g. Lobby" className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          
          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition">
              Cancel
            </button>
            <button type="submit" disabled={isEditing} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition">
              {isEditing && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
