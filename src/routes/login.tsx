import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/admin-shell";
import { Lock, User } from "lucide-react";
import { useLoginViewModel } from "@/viewmodels/useLoginViewModel";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · PalmAdmin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const vm = useLoginViewModel();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm !p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <form onSubmit={vm.handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input required name="phone" className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input required type="password" name="password" className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          {vm.error && <div className="text-xs text-danger font-medium text-center">{vm.error}</div>}
          <button disabled={vm.isLoading} type="submit" className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-50">
            {vm.isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </Card>
    </div>
  );
}
