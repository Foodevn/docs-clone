import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Document } from "@/types/document";
import { toast } from "sonner";

// =============================
// 1️⃣ Lấy tất cả tài liệu
// =============================
export const useDocuments = () => {
    return useQuery({
        queryKey: ["documents"],
        queryFn: async () => {
            const res = await api.get("/documents");
            return res.data.dsDocuments as Document[];
        },
    });
};

// =============================
// 2️⃣ Lấy 1 tài liệu cụ thể
// =============================
export const useDocument = (id: number) => {
    return useQuery({
        queryKey: ["document"],
        queryFn: async () => {
            if (!id) {
                throw new Error("Document ID is required");
            }
            const res = await api.get(`/documents/${id}`);
            return res.data.document as Document;
        },
        enabled: !!id,
        initialData: null,
    });
};

// =============================
// 3️⃣ Tạo tài liệu mới
// =============================
export const useCreateDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { title: string; content: string }) => {
            const res = await api.post("/documents", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document created successfully");
        },
        onError: () => {
            toast.error("Failed to create document");
        }
    });
};

// =============================
// Cập nhật tài liệu
// =============================
export const useUpdateDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: { title: string };
        }) => {
            const res = await api.put(`/documents/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document"] });
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document updated successfully");
        },
        onError: () => {
            toast.error("Failed to update document");
        }
    });
};

// =============================
// 5️⃣ Xóa tài liệu
// =============================
export const useDeleteDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, permission }: { id: number; permission: string }) => {
            const res = await api.delete(`/documents/${id}`, {
                data: { permission }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete document");
        }
    });
};
