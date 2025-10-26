import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";
import { documents } from "@/db/schema";

type Document = typeof documents.$inferSelect;

interface DocumentProps {
    preloadedDocument: Document;
}


export const Document = ({ preloadedDocument }: DocumentProps) => {
    return (
        <Room>
            <div className="min-h-screen bg-[#FAFBFD]">
                <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
                    <Navbar />
                    <Toolbar />
                </div>
                <div className="pt-[114px] print:pt-0">
                    <Editor initialContent={preloadedDocument.initialContent as string} />
                </div>
            </div>
        </Room>
    );
};