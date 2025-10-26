"use client";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, TrashIcon } from "lucide-react";
import { useOrganizations } from "@/hooks/use-organization";
import { useUserOrg } from "@/hooks/use-userOrg";



interface SettingDialogProps {
    organizationId: string,
    name: string,
    description: string,
    role: string,
    children: React.ReactNode
}
interface CurrentUser {
    id: string;
    email: string,
    name: string,
    role: string,
}

export const SettingDialog = ({
    children,
    organizationId,
    name,
    description,
    role
}: SettingDialogProps) => {
    const [open, setOpen] = useState(false);
    const [nameUpdate, setNameUpdate] = useState(name);
    const [descriptionUpdate, setdescriptionUpdate] = useState(description);
    const [emailInvite, setEmailInvite] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<CurrentUser>({
        id: "string",
        email: "string",
        name: "string",
        role: "string",
    });

    const { updateOrganizationMutation, deleteOrganizationMutation } = useOrganizations();
    const { members, addMemberMutation, deleteMemberMutation } = useUserOrg(organizationId);
    // const { toast } = useToast(); // Nếu bạn sử dụng toast

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const res = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "include", // gửi cookie
            });

            if (!res.ok) return null;
            const data = await res.json();
            setCurrentUser(data.user);
        }
        fetchCurrentUser();

    }, [])

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateOrganizationMutation.mutate(
            {
                organizationId,
                name: nameUpdate,
                description: descriptionUpdate,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            }
        );
    };
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteOrganizationMutation.mutate(organizationId,
            {
                onSuccess: () => {
                    setOpen(false);
                },
            }
        );
    };

    const deleteMember = (e: React.MouseEvent, userId: string) => {
        e.stopPropagation();
        deleteMemberMutation.mutate({ userId });
    };



    // Hàm validate email
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Kiểm tra email đã tồn tại trong organization chưa
    const isEmailAlreadyMember = (email: string): boolean => {
        return members.some(member =>
            member.email.toLowerCase() === email.toLowerCase()
        );
    };

    // Handle thêm thành viên với validation
    const handleAddMember = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Reset error
        setEmailError("");

        // Validate email không được rỗng
        if (!emailInvite.trim()) {
            setEmailError("Email is required");
            return;
        }

        // Validate định dạng email
        if (!isValidEmail(emailInvite)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        // Kiểm tra email đã là thành viên chưa
        if (isEmailAlreadyMember(emailInvite)) {
            setEmailError("This user is already a member");
            return;
        }

        // Nếu tất cả validation pass, gọi mutation
        addMemberMutation.mutate(
            { email: emailInvite },
            {
                onSuccess: () => {
                    setEmailInvite(""); // Reset input
                    setEmailError(""); // Reset error
                    // toast({
                    //     title: "Success",
                    //     description: "Member invited successfully",
                    // });
                },
                onError: (error: Error) => {
                    setEmailError(error.message || "Failed to invite member");
                    // toast({
                    //     title: "Error",
                    //     description: "Failed to invite member",
                    //     variant: "destructive",
                    // });
                },
            }
        );
    };


    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    };
    const DropMenu = ({ userId }: { userId: string }) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={(e) => deleteMember(e, userId)}
                    >
                        <TrashIcon className="size-4 mr-2" />
                        Kick
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Setting Organization</DialogTitle>
                </DialogHeader>
                <div className="my-4 space-y-3">
                    <Input
                        value={nameUpdate}
                        onChange={(e) => setNameUpdate(e.target.value)}
                        placeholder="Organization name"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                        value={descriptionUpdate}
                        onChange={(e) => setdescriptionUpdate(e.target.value)}
                        placeholder="Organization description"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                {/* ✅ Email invite section with validation */}
                <div className="my-4 space-y-2">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                value={emailInvite}
                                onChange={(e) => {
                                    setEmailInvite(e.target.value);
                                    setEmailError(""); // Clear error khi user đang gõ
                                }}
                                placeholder="Email your friend"
                                onClick={(e) => e.stopPropagation()}
                                className={emailError ? "border-red-500" : ""}
                            />
                            {emailError && (
                                <p className="text-red-500 text-xs mt-1">{emailError}</p>
                            )}
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddMember}
                            disabled={addMemberMutation.isPending || !emailInvite.trim()}
                        >
                            {addMemberMutation.isPending ? "Inviting..." : "Invite"}
                        </Button>
                    </div>
                </div>

                {/* hiển thị danh sách thành viên */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-500">
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Joined</th>
                                <th className="py-3 px-4">Role</th>
                                {role.trim().toLowerCase() === "admin" && <th className="py-3 px-4 text-right">Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {members.map((m) => (
                                <tr
                                    key={m.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    {/* User */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold overflow-hidden">
                                                {m.avatarUrl ? (
                                                    <img src={m.avatarUrl} className="h-full w-full object-cover" />
                                                ) : (
                                                    m.name.charAt(0).toUpperCase()
                                                )}
                                            </div>

                                            <div>
                                                <div className="font-medium">{m.name}</div>
                                                <div className="text-gray-500 text-xs">
                                                    {m.email}
                                                    {m.id == currentUser.id && (
                                                        <span className="ml-2 text-[10px] px-2 py-[2px] bg-gray-200 rounded-full">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Joined */}
                                    <td className="py-3 px-4 text-gray-600">
                                        {formatDate(m.joinedAt)}
                                    </td>

                                    {/* Role */}
                                    <td className="py-3 px-4">
                                        <div className="text-gray-800 font-medium">
                                            {m.role}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    {(role.trim().toLowerCase() === "admin" && m.role.trim().toLowerCase() !== "admin") && (
                                        <td className="py-3 px-4 text-right">
                                            <DropMenu
                                                userId={m.id as string}
                                            />
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        // disabled={isUpdating}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>

                    {role.trim().toLowerCase() === "admin" ? (<Button
                        type="button"
                        disabled={updateOrganizationMutation.isPending || !name.trim()}
                        onClick={handleDelete}
                    >
                        {updateOrganizationMutation.isPending ? "Removing..." : "Remove"}
                    </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                            }}
                        >
                            Leave
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={updateOrganizationMutation.isPending || !name.trim()}
                        onClick={handleSave}
                    >
                        {updateOrganizationMutation.isPending ? "Saving..." : "Save"}
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};