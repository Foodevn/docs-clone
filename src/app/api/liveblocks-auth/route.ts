import api from "@/lib/axios";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";


const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { room, accessToken } = await req.json();
        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await api.get('/users/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Token đặt ở đây
            }
        });

        const data = response.data;
        const user = data.user;
        const url = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.displayName ?? "A")}`;

        if (user) {
            const userId = String(user.id);
            const session = liveblocks.prepareSession(userId, {
                userInfo: {
                    name: user.displayName || "Anonymous",
                    avatar: user.avatarUrl || url,
                },
            });

            session.allow(room, session.FULL_ACCESS);

            const { body, status } = await session.authorize();
            return new Response(body, { status });
        }

        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );

    } catch (error) {
        console.error("Liveblocks auth error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}