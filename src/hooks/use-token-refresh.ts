"use client";

import { useEffect } from "react";

/**
 * Hook tự động refresh token định kỳ
 * Sử dụng trong layout hoặc component root
 */
export function useTokenRefresh(intervalMinutes: number = 10) {
    useEffect(() => {
        // Refresh ngay khi mount
        const refreshToken = async () => {
            try {
                const response = await fetch("/api/refresh", {
                    method: "POST",
                    credentials: "include",
                });

                if (!response.ok) {
                    console.warn("Token refresh failed, user may need to re-login");
                }
            } catch (err) {
                console.error("Token refresh error:", err);
            }
        };

        // Gọi lần đầu
        refreshToken();

        // Thiết lập interval để refresh định kỳ
        const intervalId = setInterval(refreshToken, intervalMinutes * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [intervalMinutes]);
}
