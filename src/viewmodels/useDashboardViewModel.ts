import { useQuery } from "@tanstack/react-query";
import { attendanceApi, usersApi, dashboardApi } from "@/api";
import { useMemo } from "react";

export function useDashboardViewModel() {
  const { data: attendanceRes, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["recentCheckIns"],
    queryFn: () => attendanceApi.getAllAttendance(1, 100),
  });
  
  const { data: summaryRes, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: () => dashboardApi.getSummary(),
  });

  const { data: usersRes } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
  });

  const recentCheckInsData = attendanceRes?.data || [];
  
  // Memoize users map for performance
  const usersMap = useMemo(() => {
    return new Map(usersRes?.data?.map(u => [u.id, u]) || []);
  }, [usersRes?.data]);
  
  // Calculate real stats
  const totalEmployees = summaryRes?.data?.total_users || 0;
  const palmRegistered = summaryRes?.data?.active_palm_templates || 0;
  const checkInsToday = summaryRes?.data?.check_ins_today || 0;
  const totalDevices = summaryRes?.data?.total_devices || 0;
  
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysCheckIns = recentCheckInsData.filter(a => a.attendance_date.startsWith(todayStr));

  const presentToday = todaysCheckIns.filter(a => a.status === "present" || a.status === "late").length;
  const lateToday = todaysCheckIns.filter(a => a.status === "late").length;
  const incompleteToday = todaysCheckIns.filter(a => a.status === "incomplete").length;
  
  const absentToday = Math.max(0, totalEmployees - presentToday - incompleteToday);

  const realStats = [
    { icon: undefined, label: "Total employees", value: totalEmployees.toString(), tone: "text-foreground", bg: "bg-muted/50 text-foreground" },
    { icon: undefined, label: "Check-ins today", value: checkInsToday.toString(), tone: "text-primary", bg: "bg-primary/10 text-primary" },
    { icon: undefined, label: "Total devices", value: totalDevices.toString(), tone: "text-warning-foreground", bg: "bg-warning/10 text-warning-foreground" },
    { icon: undefined, label: "Palm registered", value: palmRegistered.toString(), tone: "text-foreground", bg: "bg-muted/50 text-foreground" },
  ];

  const realStatusBreakdown = [
    { color: "bg-primary", label: "Present", value: presentToday - lateToday },
    { color: "bg-warning-foreground", label: "Late", value: lateToday },
    { color: "bg-danger-foreground", label: "Incomplete", value: incompleteToday },
    { color: "bg-destructive", label: "Absent", value: absentToday },
  ];

  const today = new Date();
  const currentDay = today.getDay();
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const realWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    const dateStr = d.toISOString().split("T")[0];
    
    // If this day is strictly in the future, return null
    if (d > today && d.getDate() !== today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() || d > today && (d.getMonth() !== today.getMonth() || d.getFullYear() !== today.getFullYear())) {
      return { day: dayName, value: null, pct: 0 };
    }
    // simplified future check since we only care if it's strictly > today string:
    if (dateStr > todayStr) {
      return { day: dayName, value: null, pct: 0 };
    }

    const dayCheckIns = recentCheckInsData.filter(a => a.attendance_date.startsWith(dateStr));
    const dayPresent = dayCheckIns.filter(a => a.status === "present" || a.status === "late").length;
    
    const pct = totalEmployees > 0 ? Math.round((dayPresent / totalEmployees) * 100) : 0;
    
    return { day: dayName, value: dayPresent, pct };
  });

  return {
    recentCheckInsData,
    usersMap,
    isLoadingAttendance,
    isLoadingSummary,
    realStats,
    realStatusBreakdown,
    realWeek,
  };
}
