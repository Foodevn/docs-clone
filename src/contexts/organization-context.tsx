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

// ✅ Define API response types
interface OrganizationData {
    organizations: {
        id: string;
        name: string;
        description: string | null;
        updatedAt: Date;
    };
    user_organizations: {
        role: string;
    };
}

interface GetOrganizationsResponse {
    userOrganizationsDS: OrganizationData[];
}

interface OrganizationContextType {
    organizations: Organization[];
    current: Organization | undefined;
    setCurrent: (org: Organization | undefined) => void;
    loading: boolean;
    error: Error | null;
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

            if (!res.ok) {
                throw new Error("Failed to fetch organizations");
            }

            const data: GetOrganizationsResponse = await res.json();

            const result = data.userOrganizationsDS.map((item) => ({
                id: item.organizations.id,
                name: item.organizations.name,
                description: item.organizations.description || "",
                updatedAt: new Date(item.organizations.updatedAt).getTime(),
                role: item.user_organizations.role,
            }));

            return result;
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
