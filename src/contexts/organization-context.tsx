"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface Organization {
    id: string;
    name: string;
    description: string;
    updatedAt: number;
    role: string;
}

interface OrganizationContextType {
    organizations: Organization[];
    current: Organization | undefined;
    setCurrent: (org: Organization | undefined) => void;
    loading: boolean;
    error: any;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
    const [current, setCurrent] = useState<Organization | undefined>();

    // 📌 GET organizations (LIST)
    const {
        data: organizations = [] as Organization[],
        isLoading: loading,
        error,
    } = useQuery<Organization[]>({
        queryKey: ["organizations"],
        queryFn: async () => {
            const res = await fetch("/api/db/organization");
            const data = await res.json();
            const result = data.userOrganizationsDS.map((item: any) => ({
                id: item.organizations.id,
                name: item.organizations.name,
                description: item.organizations.description,
                updatedAt: item.organizations.updatedAt,
                role: item.user_organizations.role,
            }));

            return result as Organization[];
        },
    });

    // Auto-select first organization if none selected
    useEffect(() => {
        if (organizations.length > 0 && !current) {
            setCurrent(organizations[0]);
        }
    }, [organizations, current]);

    return (
        <OrganizationContext.Provider value={{ organizations, current, setCurrent, loading, error }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useCurrentOrganization() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error("useCurrentOrganization must be used within OrganizationProvider");
    }
    return context;
}
