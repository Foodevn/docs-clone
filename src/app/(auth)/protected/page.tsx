"use client";

import { useEffect, useState } from "react";

export default function ProtectedPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/db/user")
            .then((res) => res.json())
            .then((data) => {
                setProfile(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-8">Đang tải...</p>;
    if (!profile) return <p className="p-8 text-red-600">Không thể tải thông tin người dùng.</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-blue-600">Xin chào, {profile.email}</h1>
            <p className="text-gray-600 mt-2">Bạn đang ở khu vực bảo mật 🔒</p>

            <form action="/api/logout" method="POST">
                <button
                    type="submit"
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                >
                    Đăng xuất
                </button>
            </form>
        </div>
    );
}
