"use client";

import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";
import Permission from "@/components/auth/permission";
import { useDocument } from "@/hooks/useDocuments";
import LoadingPage from "./loading";

interface DocumentProps {
    documentId: number;
};

export const Document = ({ documentId }: DocumentProps) => {
    const { data: document, isLoading } = useDocument(documentId);

    if (isLoading || !document) {
        return <LoadingPage />
    }
    return (
        <Room initialTitle={document.title}>
            <Permission documentId={documentId} >
                <div className="min-h-screen bg-[#FAFBFD]">
                    <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
                        <Navbar data={document} />
                        <Toolbar />
                    </div>
                    <Editor />
                </div>
            </Permission>
        </Room>
    );
};
