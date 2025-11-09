import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { DocumentPermissions } from "@/types/docuemntPermission";

export const useDocumentPermissions = (documentId?: string) => {
    return useQuery({
        queryKey: ["documentPermissions", documentId],
        queryFn: async () => {
            if (!documentId) return null;
            const res = await api.get(`/documentpermissions/id/${documentId}`);
            return res.data.documentPermissions as DocumentPermissions[];
        },
        enabled: !!documentId,
    });
}

// =============================
// Tạo permission mới
// =============================
export const useAddPermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { email: string; documentId: string }) => {
            const res = await api.post("/documentpermissions/add", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentPermissions"] });
            toast.success("Đã thêm thành viên");
        },
        onError: () => {
            toast.error("thêm thành viên thất bại");
        }
    });
};
