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