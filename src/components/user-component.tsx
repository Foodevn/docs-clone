"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ✅ Define User interface
interface User {
    id: string;
    email: string;
    name: string | null;
    avatar?: string;
    imageUrl?: string;
}

// ✅ Define API response type
interface GetUserResponse {
    user: User;
}

export const UserButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch user data
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data: GetUserResponse = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };
        fetchUser();
    }, []);



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
            await fetch("/api/logout", { method: "POST" });
            router.push("/sign-in");
        } catch (error) {
            console.error("Sign out failed", error);
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition"
            >
                {user.avatar || user.imageUrl ? (
                    <Image
                        src={user.avatar || user.imageUrl || ""}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                ) : (
                    <span>{user.email?.[0]?.toUpperCase()}</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <button
                        onClick={() => router.push("/profile")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Profile
                    </button>

                    <button
                        onClick={() => router.push("/reports")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Reports
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};