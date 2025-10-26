"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { documents } from "@/db/schema";
import { DocumentMenu } from "./document-menu";

type Document = typeof documents.$inferSelect;

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
            <TableCell className="w-[50px]">
                <SiGoogledocs className="size-6 fill-blue-500" />
            </TableCell>
            <TableCell
                onClick={() => router.push(`/documents/${document.id}`)}
                className="font-medium md:w-[45%] cursor-pointer"
            >
                {document.title}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
                {document.organizationId
                    ? <Building2Icon className="size-4" />
                    : <CircleUserIcon className="size-4" />
                }
                {document.organizationId ? "Organization" : "Personal"}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
                {format(new Date(document.createdAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="flex justify-end">
                <DocumentMenu
                    documentId={document.id}
                    title={document.title}
                    onNewTab={onNewTabClick}
                />
            </TableCell>
        </TableRow>
    );
};
