import { useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { devicesApi } from "@/api";
import { Device } from "@/api/types";

export function useDevicesViewModel() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: () => devicesApi.getDevices(),
  });

  const devicesList = useMemo(() => response?.data || [], [response?.data]);

  const createMutation = useMutation({
    mutationFn: (newDevice: Partial<Device>) => devicesApi.createDevice(newDevice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setIsCreateOpen(false);
    },
  });

  const handleCreateSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      device_name: fd.get("device_name") as string,
      device_code: fd.get("device_code") as string,
      location_name: fd.get("location_name") as string,
    });
  }, [createMutation]);

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; data: Partial<Device> }) => devicesApi.updateDevice(args.id, args.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setEditingDevice(null);
    },
  });

  const handleEditSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDevice) return;
    const fd = new FormData(e.currentTarget);
    updateMutation.mutate({
      id: editingDevice.id,
      data: {
        device_name: fd.get("device_name") as string,
        device_code: fd.get("device_code") as string,
        location_name: fd.get("location_name") as string,
      }
    });
  }, [editingDevice, updateMutation]);

  const handleToggleStatus = useCallback((device: Device) => {
    const newStatus = device.status === "active" ? "inactive" : "active";
    updateMutation.mutate({
      id: device.id,
      data: { status: newStatus }
    });
  }, [updateMutation]);

  return {
    devicesList,
    isLoading,
    isCreateOpen,
    setIsCreateOpen,
    editingDevice,
    setEditingDevice,
    isCreating: createMutation.isPending,
    isEditing: updateMutation.isPending,
    handleCreateSubmit,
    handleEditSubmit,
    handleToggleStatus,
  };
}
