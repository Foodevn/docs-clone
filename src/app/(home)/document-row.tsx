"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";
import { User, UserLock } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Document } from "@/types/document";
import { DocumentMenu } from "./document-menu";

interface DocumentRowProps {
    document: Document;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
    const router = useRouter();
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

                {document.permission == "admin"
                    ? <UserLock className="size-4" />
                    : <User className="size-4" />
                }
                {document.permission}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
                {format(new Date(document.createdAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="flex justify-end">
                <DocumentMenu
                    document={document}
                />
            </TableCell>
        </TableRow>
    );
};
