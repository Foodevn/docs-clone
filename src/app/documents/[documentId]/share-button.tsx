"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Lock, X, Copy, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ShareButton() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [emailInvite, setEmailInvite] = useState("");
    const [emailError, setEmailError] = useState("");


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // Giả lập mutation thêm thành viên
    const addMemberMutation = {
        isPending: false,
    };

    const currentUser = {
        id: "u001",
        name: "Phúc Hoàng",
        email: "phuc@example.com",
    };

    const role = "Admin"; // vai trò hiện tại của người dùng đang xem

    // Dữ liệu mẫu danh sách thành viên
    const [members] = useState([
        {
            id: "u001",
            name: "Phúc Hoàng",
            email: "phuc@example.com",
            role: "Admin",
            avatarUrl: "",
            joinedAt: "2024-11-01T10:00:00Z",
        },
        {
            id: "u002",
            name: "Ngọc Anh",
            email: "ngocanh@example.com",
            role: "Editor",
            avatarUrl: "",
            joinedAt: "2024-11-03T15:30:00Z",
        },
        {
            id: "u003",
            name: "Minh Tâm",
            email: "minhtam@example.com",
            role: "Viewer",
            avatarUrl: "",
            joinedAt: "2024-11-05T09:20:00Z",
        },
    ]);

    const handleAddMember = () => {
        if (!emailInvite.includes("@")) {
            setEmailError("Email không hợp lệ");
            return;
        }
        alert(`Đã gửi lời mời tới ${emailInvite}`);
        setEmailInvite("");
    };

    const DropMenu = ({ userId }: { userId: string }) => (
        <button
            onClick={() => alert(`Xóa user có id = ${userId}`)}
            className="text-red-500 text-sm hover:underline"
        >
            Remove
        </button>
    );

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }


    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-slate-800 font-medium px-4 py-2 rounded-full transition-all duration-150 border border-transparent ">
                <Lock size={16} className="text-slate-700" />
                <span>Chia Sẻ</span>
                <ChevronDown size={16} className="text-slate-700" />
            </button>

            {/*Popup chia sẻ */}
            {open && (
                <div className=" absolute right-0 mt-3 bg-white  shadow-xl rounded-xl border border-gray-200 p-4 z-50  "  >
                    <div className="flex justify-between items-center mb-3">
                        <p></p>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>
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

                </div>
            )}
        </div >
    );
}
//<div
//     className=" absolute right-0 mt-3 w-96 bg-white  shadow-xl rounded-xl border border-gray-200 p-4 z-50  "  >
//     {/* Header */}
//     <div className="flex justify-between items-center mb-3">
//         <h2 className="text-base font-medium">Chia sẻ “Nháp”</h2>
//         <button
//             onClick={() => setOpen(false)}
//             className="text-gray-500 hover:text-gray-700"
//         >
//             <X size={18} />
//         </button>
//     </div>

//     {/* Ô thêm người */}
//     <input
//         type="text"
//         placeholder="Thêm người, nhóm, không gian và sự kiện trên lịch"
//         className=" w-full border border-gray-300 rounded-lg  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4  "
//     />

//     {/* Người có quyền truy cập */}
//     <div className="mb-4">
//         <p className="text-sm text-gray-500 mb-2">Những người có quyền truy cập</p>
//         <div className="flex items-center gap-3">
//             <img
//                 src="https://www.gravatar.com/avatar/?d=mp"
//                 alt="avatar"
//                 className="w-8 h-8 rounded-full"
//             />
//             <div className="flex flex-col">
//                 <span className="text-sm font-medium text-gray-800">Hoàng Phúc (you)</span>
//                 <span className="text-xs text-gray-500">hoangphuc0918065630@gmail.com</span>
//             </div>
//             <span className="ml-auto text-xs text-gray-500">Chủ sở hữu</span>
//         </div>
//     </div>

//     {/* Quyền truy cập chung */}
//     <div className="border-t pt-3">
//         <p className="text-sm text-gray-500 mb-2">Quyền truy cập chung</p>
//         <div className="flex items-center justify-between">
//             <div>
//                 <p className="text-sm font-medium text-gray-800">Hạn chế</p>
//                 <p className="text-xs text-gray-500">
//                     Chỉ những người có quyền truy cập mới có thể mở bằng đường liên kết này
//                 </p>
//             </div>
//             <ChevronDown size={16} className="text-gray-500" />
//         </div>

//         {/* Nút sao chép link */}
//         <button
//             className="  mt-4 flex items-center justify-center gap-2  w-full bg-blue-100 hover:bg-blue-200   text-blue-700 text-sm font-medium  rounded-full py-2 transition-all " >
//             <Copy size={16} />
//             Sao chép đường liên kết
//         </button>
//     </div>

//     {/* Cài đặt */}
//     <div className="absolute top-4 right-10 text-gray-500 hover:text-gray-700 cursor-pointer">
//         <Settings size={16} />
//     </div>
// </div>