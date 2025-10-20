"use client";

import { useTokenRefresh } from "@/hooks/use-token-refresh";

/**
 * Client wrapper để tự động refresh token
 * Sử dụng trong root layout
 */
export function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
    // Tự động refresh token mỗi 10 phút
    useTokenRefresh(10);
    return <>{children}</>;
}
