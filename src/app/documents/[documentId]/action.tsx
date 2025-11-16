import api from "@/lib/axios";
import { Document } from "@/types/document";

export async function getDocuments(id: string[]) {
    const response = await api.get("/documents");
    return response.data.dsDocuments as Document[]
};