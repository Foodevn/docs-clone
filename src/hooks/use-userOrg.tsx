"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Member {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    joinedAt: number;
    role: string;
}

// ✅ Define API response types
interface OrganizationMemberData {
    users: {
        id: string;
        name: string;
        email: string;
        imageUrl?: string;
    };
    user_organizations: {
        joinedAt: Date;
        role: string;
    };
}

interface GetMembersResponse {
    data: OrganizationMemberData[];
}

interface AddMemberResponse {
    success: boolean;
    data?: unknown;
    error?: string;
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

            if (!res.ok) {
                throw new Error("Failed to fetch members");
            }

            const data: GetMembersResponse = await res.json();

            const result = data.data.map((item) => ({
                id: item.users.id,
                name: item.users.name,
                email: item.users.email,
                joinedAt: new Date(item.user_organizations.joinedAt).getTime(),
                role: item.user_organizations.role,
            }));

            return result;
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

            if (!res.ok) {
                const error: AddMemberResponse = await res.json();
                throw new Error(error.error || "Failed to add member");
            }

            return res.json() as Promise<AddMemberResponse>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations", organizationId] });
            toast.success("Member added successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message);
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