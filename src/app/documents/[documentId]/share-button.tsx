"use client";

import { useState } from "react";
import { ChevronDown, Eye, Lock, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/components/auth/permission";
import DropMenuAction from "./drop-menu-user";
import { useAddPermission, useDocumentPermissions } from "@/hooks/useDocumentPermissions";
import { useAuthStore } from "@/stores/useAuthStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function ShareButton() {
    const [emailInvite, setEmailInvite] = useState("");
    const [emailError, setEmailError] = useState("");
    const permission = usePermission().permission;
    const documentId = usePermission().documentId;
    const currentUser = useAuthStore((s) => s.user);
    const { mutate: addPermission, isPending } = useAddPermission();

    const { data: members } = useDocumentPermissions(documentId);

    const handleAddMember = () => {
        if (!emailInvite.includes("@")) {
            setEmailError("Email không hợp lệ");
            return;
        }
        addPermission({ email: emailInvite, documentId }, {
            onSuccess: () => {
                setEmailInvite("");
            }
        })

    };

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    // dành cho viewer
    if (permission.role != "admin" && permission.role !== "member") {
        return (
            <div
                className="flex items-center gap-2 bg-blue-100  text-slate-800 font-medium px-4 py-2 rounded-full transition-all duration-150 border border-transparent ">
                <Eye size={16} className="text-slate-700" />
                <span>chỉ xem</span>
            </div>
        )
    }

    // dành cho member
    if (permission.role != "admin") {
        return (
            <div
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-slate-800 font-medium px-4 py-2 rounded-full transition-all duration-150 border border-transparent ">
                <PencilLine size={16} className="text-slate-700" />
                <span>chỉnh sửa</span>
            </div>
        )
    }

    //dành cho admin
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-slate-800 font-medium px-4 py-2 rounded-full transition-all duration-150 border border-transparent">
                    <Lock size={16} className="text-slate-700" />
                    <span>Chia Sẻ</span>
                    <ChevronDown size={16} className="text-slate-700" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[600px] p-4">
                {/* Content giống như trước */}
                <div className="flex justify-between items-center mb-3">
                    <p></p>
                </div>

                <div className="my-4 space-y-2">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                value={emailInvite}
                                onChange={(e) => {
                                    setEmailInvite(e.target.value);
                                    setEmailError("");
                                }}
                                placeholder="Email your friend"
                                className={emailError ? "border-red-500" : ""}
                            />
                            {emailError && (
                                <p className="text-red-500 text-xs mt-1">{emailError}</p>
                            )}
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddMember}
                            disabled={isPending || !emailInvite.trim()}
                        >
                            {isPending ? "Inviting..." : "Invite"}
                        </Button>
                    </div>
                </div>

                {/* Table members */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-500">
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Joined</th>
                                <th className="py-3 px-4">Role</th>
                                {permission.role.trim().toLowerCase() === "admin" && <th className="py-3 px-4 text-right">Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {members && members.map((m) => (
                                <tr
                                    key={m.userId}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    {/* User */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold overflow-hidden">
                                                {m.avartarUrl ? (
                                                    <img src={m.avartarUrl} className="h-full w-full object-cover" />
                                                ) : (
                                                    m.displayName.charAt(0).toUpperCase()
                                                )}
                                            </div>

                                            <div>
                                                <div className="font-medium">{m.displayName}</div>
                                                <div className="text-gray-500 text-xs">
                                                    {m.email}

                                                    {m.userId == currentUser?._id && (
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
                                        {formatDate(m.createAt)}
                                    </td>

                                    {/* Role */}
                                    <td className="py-3 px-4">
                                        <div className="text-gray-800 font-medium">
                                            {m.permission}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    {(permission.role.trim().toLowerCase() === "admin" && m.permission.trim().toLowerCase() !== "admin") && (
                                        <td className="py-3 px-4 text-right">
                                            <DropMenuAction
                                                role={m.permission}
                                                userId={m.userId}
                                                documentId={documentId}
                                            />
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
