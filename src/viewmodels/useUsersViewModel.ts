import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api";
import { useApp } from "@/contexts/AppContext";
import type { User } from "@/api/types";

export const usersTabs = ["All users", "Pending enrollment", "Inactive"] as const;
export type UsersTab = typeof usersTabs[number];

export function useUsersViewModel() {
  const [tab, setTab] = useState<UsersTab>("All users");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, searchQuery]);
  
  const { state, dispatch } = useApp();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers().then(res => Array.isArray(res?.data) ? res.data : []),
  });

  useEffect(() => {
    if (users.length > 0) {
      dispatch({ type: "SET_USER_COUNT", payload: users.length });
    }
  }, [users.length, dispatch]);

  const filtered = useMemo(() => {
    const usersArray = Array.isArray(users) ? users : [];
    return usersArray.filter((u) => {
      if (tab === "Pending enrollment" && u.is_palm_registered !== false && u.palm_status !== "unregistered") return false;
      if (tab === "Inactive" && u.status !== "inactive") return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = (u.full_name || "").toLowerCase().includes(query);
        const matchCode = (u.employee_code || "").toLowerCase().includes(query);
        const matchPhone = (u.phone || "").toLowerCase().includes(query);
        const matchEmail = (u.email || "").toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchPhone && !matchEmail) return false;
      }
      
      return true;
    });
  }, [users, tab, searchQuery]);

  const totalPages = Math.ceil(filtered.length / 10) || 1;
  const paginatedUsers = useMemo(() => {
    return filtered.slice((currentPage - 1) * 10, currentPage * 10);
  }, [filtered, currentPage]);

  const createMutation = useMutation({
    mutationFn: (newUser: Partial<User>) => usersApi.createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateOpen(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: (args: { id: string; data: Partial<User> }) => usersApi.updateUser(args.id, args.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    },
  });

  const handleCreateSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      full_name: fd.get("full_name") as string,
      employee_code: fd.get("employee_code") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      department: fd.get("department") as string,
      role: fd.get("role") as string,
      status: "active",
      password: "user1234",
    });
  }, [createMutation]);

  const handleEditSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    
    const fd = new FormData(e.currentTarget);
    editMutation.mutate({
      id: editingUser.id,
      data: {
        full_name: fd.get("full_name") as string,
        employee_code: fd.get("employee_code") as string,
        email: fd.get("email") as string,
        phone: fd.get("phone") as string,
        department: fd.get("department") as string,
        role: fd.get("role") as string,
      }
    });
  }, [editingUser, editMutation]);

  const handleToggleStatus = useCallback((user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    editMutation.mutate({
      id: user.id,
      data: { status: newStatus }
    });
  }, [editMutation]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDeleteUser = useCallback((id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  return {
    // State
    tab,
    searchQuery,
    isCreateOpen,
    editingUser,
    userCount: state.userCount,
    
    // Derived
    filteredUsers: filtered, // keep it for compatibility or tests
    paginatedUsers,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    isError,
    error,
    isCreating: createMutation.isPending,
    isEditing: editMutation.isPending,
    
    // Actions
    setTab,
    setSearchQuery,
    setIsCreateOpen,
    setEditingUser,
    handleCreateSubmit,
    handleEditSubmit,
    handleToggleStatus,
    handleDeleteUser,
    isDeleting: deleteMutation.isPending,
  };
}
