import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi, usersApi } from "@/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const calculateWorkHours = (checkIn?: string | null, checkOut?: string | null): string => {
  if (!checkIn || !checkOut) return '—';
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  const diffMs = end - start;
  if (diffMs <= 0) return '—';
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export function useAttendanceViewModel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: usersRes } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["attendance", selectedUserId, startDate, endDate],
    queryFn: () => selectedUserId 
      ? attendanceApi.getUserAttendanceHistory(selectedUserId, startDate, endDate)
      : attendanceApi.getAllAttendance(1, 20, startDate, endDate),
  });

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSelectedUserId(null);
      return;
    }
    const query = searchQuery.toLowerCase();
    const matchedUser = usersRes?.data?.find(u => 
      (u.full_name || "").toLowerCase().includes(query) || 
      (u.employee_code || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query)
    );
    if (matchedUser) {
      setSelectedUserId(matchedUser.id);
    } else {
      alert("No matching employee found");
    }
  }, [searchQuery, usersRes?.data]);

  const logs = useMemo(() => response?.data || [], [response?.data]);
  // Use the user from the history response if available, or fallback to the matched user from the users list
  const selectedUser = useMemo(() => {
    if ((response as any)?.user) return (response as any).user;
    if (selectedUserId && usersRes?.data) {
      return usersRes.data.find(u => u.id === selectedUserId);
    }
    return null;
  }, [response, selectedUserId, usersRes?.data]);
  
  const summary = useMemo(() => (response as any)?.summary || null, [response]);

  const handleExportExcel = useCallback(() => {
    if (logs.length === 0) return;
    const data = logs.map(r => {
      const u = usersRes?.data?.find(user => user.id === r.user_id);
      return {
        "Employee": u?.full_name || 'Unknown',
        "Code": u?.employee_code || '—',
        "Department": u?.department || '—',
        "Date": r.attendance_date,
        "Check-in": r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—',
        "Check-out": r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—',
        "Work hours": r.work_duration_text || calculateWorkHours(r.check_in_time, r.check_out_time),
        "Status": r.status,
        "Device": r.device_name ? `${r.device_name} ${r.device_code ? `(${r.device_code})` : ''}` : '—',
        "In score": r.check_in_score || '—',
        "Out score": r.check_out_score || '—',
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Log");
    XLSX.writeFile(wb, "attendance log.xlsx");
  }, [logs, usersRes?.data]);

  const handleExportPDF = useCallback(() => {
    if (logs.length === 0) return;
    const doc = new jsPDF();
    doc.text("Attendance log", 14, 15);
    
    const body = logs.map(r => {
      const u = usersRes?.data?.find(user => user.id === r.user_id);
      return [
        u?.full_name || 'Unknown',
        u?.employee_code || '—',
        u?.department || '—',
        r.attendance_date,
        r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—',
        r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—',
        r.work_duration_text || calculateWorkHours(r.check_in_time, r.check_out_time),
        r.status,
        r.device_name ? `${r.device_name} ${r.device_code ? `(${r.device_code})` : ''}` : '—',
        r.check_in_score || '—',
        r.check_out_score || '—'
      ];
    });

    autoTable(doc, {
      head: [['Employee', 'Code', 'Dept', 'Date', 'Check-in', 'Check-out', 'Work hours', 'Status', 'Device', 'In score', 'Out score']],
      body: body,
      startY: 20,
    });

    doc.save("attendance log.pdf");
  }, [logs, usersRes?.data]);

  return {
    logs,
    summary,
    selectedUser,
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleSearch,
    isLoading,
    totalPages: Math.ceil((response?.meta?.pagination?.total || 0) / (response?.meta?.pagination?.limit || 1)),
    totalRecords: response?.meta?.pagination?.total || 0,
    handleExportExcel,
    handleExportPDF,
  };
}
