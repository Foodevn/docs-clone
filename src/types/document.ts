export interface Document {
    id: number;
    title: string;
    permission: string;
    content?: string;
    isPrivate?: boolean;
    createdAt: string;
    updatedAt: string;
}