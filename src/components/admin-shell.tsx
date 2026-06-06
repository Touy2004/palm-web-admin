import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Monitor,
  Fingerprint,
  AlertTriangle,
  FileText,
  Settings,
  Hand,
  LogOut,
  Menu,
} from "lucide-react";
import { useEffect, useState, createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth";

export const ShellContext = createContext({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (v: boolean) => {},
});

export function useShell() {
  return useContext(ShellContext);
}

const nav = [
  { section: "Main", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/users", label: "Users", icon: Users },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  ]},
  { section: "System", items: [
    { to: "/devices", label: "Devices", icon: Monitor },
    { to: "/palm-templates", label: "Palm templates", icon: Fingerprint },
    { to: "/reports", label: "Reports", icon: FileText },
  ]},
];

export function AdminShell({ children }: { children: ReactNode }) {
  const routerState = useRouterState({ select: (s) => s.location });
  const pathname = routerState.pathname;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("is_auth")) {
      router.navigate({ to: "/login", replace: true });
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("is_auth");
    router.navigate({ to: "/login", replace: true });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const { data: meRes, error, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  console.log("ME QUERY RESULT:", { meRes, error, isLoading });

  const me = meRes?.data?.user;
  
  const initials = useMemo(() => {
    if (!me?.full_name) return "AD";
    const parts = me.full_name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return me.full_name.substring(0, 2).toUpperCase();
  }, [me?.full_name]);

  return (
    <ShellContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
      <div className="flex min-h-screen bg-background relative">
        {/* Mobile backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Hand className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold leading-tight text-foreground">PalmAdmin</div>
            <div className="mt-1 inline-block rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">v1.0</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          {nav.map((group) => (
            <div key={group.section} className="mb-6">
              <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.section}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
              {initials}
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{me?.full_name || "Admin user"}</div>
              <div className="text-xs text-muted-foreground">{me?.department || "Super admin"}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
    </div>
    </ShellContext.Provider>
  );
}

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  const { setIsMobileMenuOpen } = useShell();
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-card/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-5">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="-ml-2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}

export function StatusPill({ kind, children }: { kind: "success" | "warning" | "danger" | "neutral"; children: ReactNode }) {
  const map = {
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    danger: "bg-danger text-danger-foreground",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[kind]}`}>
      {children}
    </span>
  );
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
      {initials}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 ${className}`}>
      {children}
    </div>
  );
}

export function statusKind(s: string): "success" | "warning" | "danger" | "neutral" {
  if (s === "present" || s === "active" || s === "registered" || s === "passed") return "success";
  if (s === "late" || s === "incomplete") return "warning";
  if (s === "absent" || s === "revoked" || s === "failed" || s === "inactive") return "danger";
  return "neutral";
}
