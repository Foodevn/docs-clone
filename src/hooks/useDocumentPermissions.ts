import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { DocumentPermissions } from "@/types/docuemntPermission";

export const useDocumentPermissions = (documentId?: number) => {
    return useQuery({
        queryKey: ["documentPermissions", documentId],
        queryFn: async () => {
            if (!documentId) return null;
            const res = await api.get(`/documentpermissions/id/${documentId}`);
            return res.data.documentPermissions as DocumentPermissions[];
        },
        enabled: !!documentId,
    });
};

// =============================
// Create new permission
// =============================
export const useAddPermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { email: string; documentId: number }) => {
            const res = await api.post("/documentpermissions/add", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentPermissions"] });
            toast.success("Member added successfully");
        },
        onError: () => {
            toast.error("Failed to add member");
        }
    });
};

// =============================
// Delete permission
// =============================
export const useDeletePermission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ documentId, userId }: { documentId: number; userId: number }) => {
            const res = await api.delete(`/documentpermissions/${documentId}`, {
                data: { userId } // Send via config.data
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentPermissions"] });
            toast.success("Removed successfully");
        },
        onError: () => {
            toast.error("Failed to remove");
        }
    });
};

// =============================
// Update permission (change role)
// =============================
export const useChangePermission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            documentId,
            data,
        }: {
            documentId: number;
            data: {
                userId: number;
                role: string;
            };
        }) => {
            const res = await api.put(`/documentpermissions/${documentId}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentPermissions"] });
            toast.success("Role updated successfully");
        },
        onError: () => {
            toast.error("Failed to update role");
        }
    });
};
