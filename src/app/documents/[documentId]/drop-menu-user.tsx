import { usePermission } from "@/components/auth/permission";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeletePermission } from "@/hooks/useDocumentPermissions";
import { Eye, MoreVertical, PencilLine, TrashIcon } from "lucide-react";
interface DropdownMenuPop {
    role: string;
    userId: number;
    documentId: string;
}


const DropMenuAction = ({ role, userId, documentId }: DropdownMenuPop) => {
    const { mutate: deletePermission, isPending } = useDeletePermission();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(" xóa quyền")
        deletePermission({
            documentId,
            userId,

        });
    }
    const handleChangeRole = (e: React.MouseEvent) => {
        e.stopPropagation();
        //todo: đổi role cho người dùng
        console.log(" đổi  quyền")
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
                        onClick={(e) => handleChangeRole(e)}
                    >
                        <PencilLine className="size-4 mr-2" />
                        member
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={(e) => handleChangeRole(e)}
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