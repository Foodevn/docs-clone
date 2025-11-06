export interface Document {
    id: number;
    title: string;
    content?: string;
    isPrivate?: boolean;
    createdAt: string;
    updatedAt: string;
}