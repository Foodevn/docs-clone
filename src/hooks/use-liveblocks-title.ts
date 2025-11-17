import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { useUpdateDocument } from "./useDocuments";


export const useLiveblocksTitle = (documentId: number) => {
    // Đọc title từ Liveblocks Storage (real-time)
    const title = useStorage((root) => root.title);

    // Mutation để cập nhật Liveblocks Storage
    const updateLiveblocksTitle = useMutation(({ storage }, newTitle: string) => {
        storage.set("title", newTitle);
    }, []);

    // Mutation để cập nhật Database
    const { mutate: updateDatabaseTitle } = useUpdateDocument();

    /**
     * Hàm cập nhật title vào cả Liveblocks và Database
     */
    const updateTitle = (newTitle: string) => {
        // 1. Cập nhật Liveblocks Storage ngay lập tức (real-time sync cho tất cả users)
        updateLiveblocksTitle(newTitle);

        // 2. Cập nhật Database (để persist data)
        updateDatabaseTitle({
            id: documentId,
            data: { title: newTitle }
        });
    };

    return {
        title,
        updateTitle,
    };
};
