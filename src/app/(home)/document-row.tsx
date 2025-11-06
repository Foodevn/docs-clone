"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";
import { BookCheck, Building2Icon, CircleUserIcon, FileKey, MoreVertical } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Document } from "@/types/document";
import { Button } from "@/components/ui/button";

interface DocumentRowProps {
    document: Document;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
    const router = useRouter();

    const onNewTabClick = (id: string) => {
        window.open(`/documents/${id}`, "_blank");
    };
    return (
        <TableRow>
            <TableCell
                onClick={() => router.push(`/documents/${document.id}`)}
                className="w-[50px] cursor-pointer"
            >
                <SiGoogledocs className="size-6 fill-blue-500" />
            </TableCell>
            <TableCell
                onClick={() => router.push(`/documents/${document.id}`)}
                className="font-medium md:w-[45%] cursor-pointer"
            >
                {document.title}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
                {document.isPrivate
                    ? <FileKey className="size-4" />
                    : <BookCheck className="size-4" />
                }

                {document.isPrivate ? "Private" : "Public"}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
                {format(new Date(document.createdAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="flex justify-end">
                {/* <DocumentMenu
                    documentId={document.id}
                    title={document.title}
                    onNewTab={onNewTabClick}
                /> */}

                <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="size-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
