"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";

export default function QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // ⚙️ tạo 1 QueryClient duy nhất mỗi lần load app
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
