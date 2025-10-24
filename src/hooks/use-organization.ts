"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizations } from "@/db/schema";
import { useState } from "react";


interface Organization {
    id: string,
    name: string,
    updatedAt: number,
    role: string,
}


export function useOrganizations() {
    const router = useRouter();
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





    return {
        organizations,
        loading,
        error,
        current,
        setCurrent,
        addOrganizationMutation,
    };
}
