"use client";

import { useRouter } from "next/navigation";
import { useSearchParam } from "./use-search-param";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documents } from "@/db/schema";
import { toast } from "sonner";

type Document = typeof documents.$inferSelect;

interface useDocumentsProps {
    organizationId?: string;
}

export function useDocuments({ organizationId }: useDocumentsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search] = useSearchParam();

    // 📌 Build URL GET
    const buildUrl = () => {
        const params = new URLSearchParams();
        if (search && search.trim() !== "") params.append("search", search);
        return `/api/db/document${params.toString() ? `?${params.toString()}` : ""}`;
    };

    // 📌 GET documents (LIST)
    const {
        data: documents = [] as Document[],
        isLoading: loading,
        error,
    } = useQuery<Document[]>({
        queryKey: ["documents", organizationId, search],
        queryFn: async () => {
            const res = await fetch(buildUrl());
            const data = await res.json();
            return data.allDocuments ?? [] as Document[];
        },
        enabled: !!organizationId, // chỉ fetch khi có orgId
    });

    // 📌 CREATE document
    const addDocumentMutation = useMutation({
        mutationFn: async ({
            title,
            initialContent,
            organizationId,
        }: {
            title: string;
            initialContent: string;
            organizationId: string;
        }) => {
            const res = await fetch(`/api/db/document`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, initialContent, organizationId }),
            });
            return res.json();
        },
        onSuccess: (newDoc: any) => {
            queryClient.invalidateQueries({ queryKey: ["documents", organizationId] });

            if (newDoc?.data?.id) {
                router.push(`/documents/${newDoc.data.id}`);
            }
            toast.success("Document create");
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    // const addDocument = (title: string, initialContent: string, organizationId: string) =>
    //     addDocumentMutation.mutate({ title, initialContent, organizationId });

    // 📌 DELETE document
    const deleteDocumentMutation = useMutation({
        mutationFn: async (documentId: string) => {
            await fetch(`/api/db/document/${documentId}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document removed");
        },
        onError: () => {
            toast.error("Something went wrong");
        }

    });


    // 📌 UPDATE document
    const updateDocumentMutation = useMutation({
        mutationFn: async ({
            documentId,
            updated,
        }: {
            documentId: string;
            updated: {
                title?: string;
                [key: string]: any;
            };
        }) => {
            const res = await fetch(`/api/db/document/${documentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ updated }),
            });

            if (!res.ok) {
                throw new Error("Failed to update document");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document updated");
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    });



    return {
        documents,
        loading,
        error,
        addDocumentMutation,
        deleteDocumentMutation,
        updateDocumentMutation,
    };
}
