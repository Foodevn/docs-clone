import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangePermission, useDeletePermission } from "@/hooks/useDocumentPermissions";
import { Eye, MoreVertical, PencilLine, TrashIcon } from "lucide-react";
interface DropdownMenuPop {
    role: string;
    userId: number;
    documentId: number;
}


const DropMenuAction = ({ role, userId, documentId }: DropdownMenuPop) => {
    const { mutate: deletePermission } = useDeletePermission();
    const { mutate: changePermission } = useChangePermission();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deletePermission({
            documentId,
            userId,
        });
    }

    const handleChangeViewerToMember = (e: React.MouseEvent) => {
        e.stopPropagation();
        changePermission({
            documentId,
            data: {
                userId,
                role: "member",
            },
        });
        console.log("doi sang member")
    }
    const handleChangeMemberToViewer = (e: React.MouseEvent) => {
        e.stopPropagation();
        changePermission({
            documentId,
            data: {
                userId,
                role: "viewer",
            },
        });
        console.log("doi sang viewer");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {role == "viewer" ? (
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={(e) => handleChangeViewerToMember(e)}
                    >
                        <PencilLine className="size-4 mr-2" />
                        member
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={(e) => handleChangeMemberToViewer(e)}
                    >
                        <Eye className="size-4 mr-2" />
                        viewer
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem
                    onClick={(e) => handleDelete(e)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                >
                    <TrashIcon className="size-4 mr-2" />
                    remove
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropMenuAction;