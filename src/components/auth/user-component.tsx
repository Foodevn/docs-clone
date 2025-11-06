"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut, Settings } from "lucide-react";

export const UserButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const [user, setUser] = useState<User | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { signOut } = useAuthStore();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    // const user = {
    //     _id: "1",
    //     username: "Hoàng Phúc",
    //     email: "hoangphuc0918065630@gmail",
    //     displayName: "Hoàng Phúc",
    //     avatarUrl: "",
    //     bio: "user",
    //     phone: "user",
    //     createdAt: "user",
    //     updatedAt: "user",
    // }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/signin");
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition"
            >
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                ) : (
                    <span>{user.displayName?.[0]?.toUpperCase()}</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-68 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="flex px-4 py-3 ">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition">
                            {user.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            ) : (
                                <span>{user.displayName?.[0]?.toUpperCase()}</span>
                            )}

                        </div>
                        <div className="px-4">
                            <p className="text-sm font-semibold text-gray-900">{user.displayName || "User"}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                        // onClick={() => router.push("/profile")}
                        className="flex w-full text-left px-8 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >

                        <Settings />
                        <p className="px-4">Profile</p>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                        onClick={handleSignOut}
                        className="flex w-full text-left px-8 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        <LogOut />
                        <p className="px-4">Sign Out</p>

                    </button>
                </div>
            )}
        </div>
    );
};