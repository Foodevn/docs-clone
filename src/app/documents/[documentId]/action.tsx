import api from "@/lib/axios";
import { Document } from "@/types/document";

export async function getDocuments() {
    const response = await api.get("/documents");
    return response.data.dsDocuments as Document[]
};
