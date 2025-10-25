"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizations } from "@/db/schema";
import { useState } from "react";


interface Organization {
    id: string,
    name: string,
    description: string,
    updatedAt: number,
    role: string,
}


export function useOrganizations() {

    const queryClient = useQueryClient();
    const [current, setCurrent] = useState<Organization>();

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

    // 📌 CREATE Organization
    const addOrganizationMutation = useMutation({
        mutationFn: async ({
            name,
            description,
        }: {
            name: string;
            description: string;
        }) => {
            const res = await fetch(`/api/db/organization`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });

        },
    });

    // ...existing code...
    const updateOrganizationMutation = useMutation({
        mutationFn: async ({
            organizationId,
            name,
            description,
        }: {
            organizationId: string;
            name?: string;
            description?: string;
        }) => {
            const res = await fetch(`/api/db/organization/${organizationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    updated: { name, description }
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update organization");
            }

            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            // Optionally update the current organization if it was updated
            if (current?.id === data.data.id) {
                setCurrent({
                    ...current,
                    name: data.data.name,
                    updatedAt: new Date(data.data.updatedAt).getTime(),
                } as Organization);
            }
        },
    });

    const deleteOrganizationMutation = useMutation({
        mutationFn: async (organizationId: string) => {
            const res = await fetch(`/api/db/organization/${organizationId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete organization");
            }

            return res.json();
        },
        onSuccess: (data, organizationId) => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });

            // Clear current organization if it was deleted
            if (current?.id === organizationId) {
                setCurrent(undefined);
            }

            // Optional: redirect to organizations list
            // router.push("/organizations");
        },
    });

    return {
        organizations,
        loading,
        error,
        current,
        setCurrent,
        addOrganizationMutation,
        updateOrganizationMutation,
        deleteOrganizationMutation
    };
}
