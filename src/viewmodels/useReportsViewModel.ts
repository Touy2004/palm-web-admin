import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi, usersApi } from "@/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useReportsViewModel() {
  const [month, setMonth] = useState("2026-06");
  const [department, setDepartment] = useState("All departments");

  const { data: reportsRes, isLoading: isLoadingReports, refetch } = useQuery({
    queryKey: ["reports", month, department],
    queryFn: () => reportsApi.getReports(month, department),
  });

  const { data: usersRes } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
  });

  const reportsList = useMemo(() => reportsRes?.data || [], [reportsRes?.data]);
  const usersMap = useMemo(() => new Map(usersRes?.data?.map(u => [u.id, u]) || []), [usersRes?.data]);

  const availableDepartments = useMemo(() => {
    if (!usersRes?.data) return [];
    const depts = new Set(usersRes.data.map(u => u.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [usersRes?.data]);

  const summaryData = useMemo(() => {
    let workingDays = 0;
    let totalLate = 0;
    let totalIncomplete = 0;
    let totalPresent = 0;

    if (reportsList.length > 0) {
      const first = reportsList[0];
      workingDays = first.present + first.late + first.incomplete + first.absent;
    }

    for (const r of reportsList) {
      totalLate += r.late;
      totalIncomplete += r.incomplete;
      totalPresent += r.present;
    }

    let avgAttendance = 0;
    if (workingDays > 0 && reportsList.length > 0) {
      const totalPossibleDays = workingDays * reportsList.length;
      avgAttendance = Math.round(((totalPresent + totalLate) / totalPossibleDays) * 100);
    }

    return {
      workingDays,
      avgAttendance: `${avgAttendance}%`,
      totalLate,
      totalIncomplete
    };
  }, [reportsList]);

  const handleExportExcel = useCallback(() => {
    if (reportsList.length === 0) return;
    const data = reportsList.map(r => {
      const user = usersMap.get(r.user_id);
      return {
        "Employee Name": user?.full_name || 'Unknown',
        "Employee Code": user?.employee_code || '—',
        "Department": user?.department || '—',
        "Present": r.present,
        "Late": r.late,
        "Incomplete": r.incomplete,
        "Absent": r.absent,
        "Avg Hours": r.avgHours
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Summary");
    XLSX.writeFile(wb, "PalmAdmin_Reports.xlsx");
  }, [reportsList, usersMap]);

  const handleExportPDF = useCallback(() => {
    if (reportsList.length === 0) return;
    const doc = new jsPDF();
    doc.text("Monthly Attendance Summary", 14, 15);
    
    const body = reportsList.map(r => {
      const user = usersMap.get(r.user_id);
      return [
        user?.full_name || 'Unknown',
        user?.employee_code || '—',
        user?.department || '—',
        r.present,
        r.late,
        r.incomplete,
        r.absent,
        r.avgHours
      ];
    });

    autoTable(doc, {
      head: [['Employee', 'Emp. code', 'Department', 'Present', 'Late', 'Incomplete', 'Absent', 'Avg hours']],
      body: body,
      startY: 20,
    });

    doc.save("PalmAdmin_Reports.pdf");
  }, [reportsList, usersMap]);

  return {
    reportsList,
    usersMap,
    summaryData,
    isLoadingReports,
    availableDepartments,
    month,
    setMonth,
    department,
    setDepartment,
    handleGenerate: refetch,
    handleExportExcel,
    handleExportPDF,
  };
}
