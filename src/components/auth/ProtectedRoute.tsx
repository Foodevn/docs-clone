"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}


const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const init = async () => {
    // có thể xảy ra khi refresh trang
    if (!accessToken) {
      await refresh();
    }

    if (accessToken && !user) {
      await fetchMe();
    }
    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  const publicRoutes = ["/signin", "/signup"];

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken && !publicRoutes.includes(pathname)) {
    router.replace("/signin");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
