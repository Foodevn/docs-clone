import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUserIcon, Tag } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import { DocumentMenu } from "./document-menu";


interface DocumentRowProps {
    document: Doc<"documents">;
}
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export const DocumentRow = ({ document }: DocumentRowProps) => {
    const router = useRouter();

    const getTag = useQuery(api.documentTags.getTagsByDocumentId, {
        documentId: document._id,
    });

    return (
        <TableRow>
            <TableCell className="w-[50px]">
                <SiGoogledocs className="size-6 fill-blue-500" />
            </TableCell>
            <TableCell
                className="font-medium md:w-[45%] cursor-pointer"
                onClick={() => router.push(`/documents/${document._id}`)}
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
                {getTag ? (
                    <span
                        key={getTag._id}
                        className="inline-flex items-center gap-1 max-w-[160px] truncate px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                            backgroundColor: getTag.color ?? "#64748b",
                            color: "#fff",
                        }}
                        title={getTag.name}
                    >
                        <Tag className="w-3 h-3" />
                        <span className="truncate">{getTag.name}</span>
                    </span>
                ) : (
                    <span className="text-muted-foreground">No Tags</span>
                )}

            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
                {format(new Date(document._creationTime), "MMM dd, yyyy")}
            </TableCell>

            <TableCell className="flex justify-end">
                <DocumentMenu
                    documentId={document._id}
                    title={document.title}
                    onNewTab={() => window.open(`/documents/${document._id}`, "_blank")}
                />
            </TableCell>
        </TableRow>
    );
};
