import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";

export function useLoginViewModel() {
  const router = useRouter();
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: (data: { phone: string; pass: string }) => authApi.login(data.phone, data.pass),
    onSuccess: (res) => {
      if (res.code === 200 || res.status === "OK") {
        localStorage.setItem("is_auth", "true");
        // Store real tokens from API
        if (res.data?.access_token) {
          localStorage.setItem("access_token", res.data.access_token);
        }
        if (res.data?.refresh_token) {
          localStorage.setItem("refresh_token", res.data.refresh_token);
        }
        router.navigate({ to: "/" });
      } else {
        setError(res.message || "Invalid credentials");
      }
    },
    onError: (err: any) => {
      setError(err.message || "An error occurred during login");
    }
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phone = fd.get("phone") as string;
    const password = fd.get("password") as string;
    
    // Mock check fallback if requested by user for local testing
    if (phone === "admin" && password === "admin123") {
      localStorage.setItem("is_auth", "true");
      // Provide a dummy token just in case
      localStorage.setItem("access_token", "dummy-admin-token");
      router.navigate({ to: "/" });
      return;
    }

    loginMutation.mutate({ phone, pass: password });
  };

  return {
    error,
    isLoading: loginMutation.isPending,
    handleLogin,
  };
}
