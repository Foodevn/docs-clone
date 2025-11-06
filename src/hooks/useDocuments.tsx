import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// =============================
// 1️⃣ Lấy tất cả tài liệu
// =============================
export const useDocuments = () => {
    return useQuery({
        queryKey: ["documents"],
        queryFn: async () => {
            const res = await api.get("/documents");
            return res.data.dsDocuments;
        },
    });
};

// =============================
// 2️⃣ Lấy 1 tài liệu cụ thể
// =============================
export const useDocument = (id?: string) => {
    return useQuery({
        queryKey: ["document", id],
        queryFn: async () => {
            if (!id) return null;
            const res = await api.get(`/documents/${id}`);
            return res.data;
        },
        enabled: !!id, // chỉ gọi khi có id
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
        },
    });
};

// =============================
// 4️⃣ Cập nhật tài liệu
// =============================
export const useUpdateDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<{ title: string; content: string }>;
        }) => {
            const res = await api.put(`/documents/${id}`, data);
            return res.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["document", id] });
        },
    });
};

// =============================
// 5️⃣ Xóa tài liệu
// =============================
export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/documents/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};
