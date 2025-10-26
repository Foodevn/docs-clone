"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useOrganizations() {
    const queryClient = useQueryClient();

    // 📌 CREATE Organization
    const addOrganizationMutation = useMutation({
        mutationFn: async ({
            name,
            description,
        }: {
            name: string;
            description: string;
        }) => {
            await fetch(`/api/db/organization`, {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
        },
    });

    return {
        addOrganizationMutation,
        updateOrganizationMutation,
        deleteOrganizationMutation
    };
}
