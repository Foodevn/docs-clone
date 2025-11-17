import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { useUpdateDocument } from "./useDocuments";


export const useLiveblocksTitle = (documentId: number) => {
    // Đọc title từ Liveblocks Storage (real-time)
    const title = useStorage((root) => root.title);

    const updateLiveblocksTitle = useMutation(({ storage }, newTitle: string) => {
        storage.set("title", newTitle);
    }, []);

    const { mutate: updateDatabaseTitle } = useUpdateDocument();

    const updateTitle = (newTitle: string) => {
        updateLiveblocksTitle(newTitle);
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
