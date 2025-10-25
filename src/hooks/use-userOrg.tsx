"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizations } from "@/db/schema";
import { useState } from "react";
import { toast } from "sonner";

interface Member {
    id: string,
    name: string,
    email: string,
    avatarUrl?: string,
    joinedAt: number,
    role: string,
}

export function useUserOrg(organizationId: string) {
    const queryClient = useQueryClient();
    // 📌 GET Member (LIST)
    const {
        data: members = [] as Member[],
        isLoading: loading,
        error,
    } = useQuery<Member[]>({
        queryKey: ["organizations", organizationId],
        queryFn: async () => {
            const res = await fetch(`/api/db/organization/${organizationId}`);
            const data = await res.json();
            const result = data.data.map((item: any) => ({
                id: item.users.id,
                name: item.users.name,
                email: item.users.email,
                joinedAt: item.user_organizations.joinedAt,
                role: item.user_organizations.role,
            }));
            return result as Member[];
        },
    });

    // 📌 CREATE Member
    const addMemberMutation = useMutation({
        mutationFn: async ({
            email,
        }: {
            email: string;
        }) => {
            const res = await fetch(`/api/db/organization/${organizationId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations", organizationId] });
        },
        onError: (res: any) => {
            console.log(res)
            toast.error(`${res.error}`);
        }
    });

    const deleteMemberMutation = useMutation({
        mutationFn: async ({
            userId,
        }: {
            userId: string;
        }) => {
            const res = await fetch(`/api/db/user-organization/${organizationId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to remove member");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations", organizationId] });
            toast.success("Member removed successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });


    return {
        members,
        loading,
        error,
        addMemberMutation,
        deleteMemberMutation
    }
}