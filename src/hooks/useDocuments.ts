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
                throw new Error("Document ID is required");  // ✅ Rõ ràng hơn
            }
            const res = await api.get(`/documents/${id}`);
            return res.data.document as Document;
        },
        enabled: !!id, // chỉ gọi khi có id
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
            toast.success("đã tạo tài liệu mới");
        },
        onError: () => {
            toast.error("lỗi khi tạo tài liệu");
        }
    });
};

// =============================
// Cập nhật tài liệu
// =============================
export const useUpdateDocument = () => {
    const queryClient = useQueryClient(
    );

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
            toast.success("tài liệu đã được cập nhật");
        },
        onError: () => {
            toast.error("cập nhật tài liệu thất bại");
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
                data: { permission }   // ⭐ Gửi qua config.data
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("tài liệu đã được xóa");
        },
        onError: () => {
            toast.error("xóa tài liệu thất bại");
        }
    });
};
