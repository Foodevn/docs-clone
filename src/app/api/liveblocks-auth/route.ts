import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/db";
import { documents, userOrganizations, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        // 1️⃣ Verify JWT token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;


        if (!token) {
            console.error("❌ No token provided");
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);

        // Support both 'id' and 'userId' for backward compatibility
        const userId = (payload?.userId || payload?.id) as string;

        if (!payload || !userId) {
            console.error("❌ Invalid token or missing user ID");
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }


        // 2️⃣ Get user from database
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - User not found" },
                { status: 401 }
            );
        }

        // 3️⃣ Get room (document) ID from request
        const { room } = await req.json();

        if (!room) {
            return NextResponse.json(
                { error: "Bad Request - Room ID required" },
                { status: 400 }
            );
        }

        // 4️⃣ Get document from database
        const [document] = await db
            .select()
            .from(documents)
            .where(eq(documents.id, room))
            .limit(1);

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // 5️⃣ Check if user is member of the document's organization
        const [membership] = await db
            .select()
            .from(userOrganizations)
            .where(
                and(
                    eq(userOrganizations.userId, userId),
                    eq(userOrganizations.organizationId, document.organizationId)
                )
            )
            .limit(1);

        if (!membership) {
            return NextResponse.json(
                { error: "Unauthorized - Not a member of this organization" },
                { status: 403 }
            );
        }

        const url = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name ?? user.email ?? "A")}`; // Generate avatar from name;
        // 6️⃣ Create Liveblocks session
        const session = liveblocks.prepareSession(userId, {
            userInfo: {
                name: user.name ?? user.email ?? "Anonymous",
                avatar: user.imageUrl?.toString() || url,
                // avatar: user.avatar, // Add if you have avatar field
            },
        });

        // Grant full access to the room
        session.allow(room, session.FULL_ACCESS);

        // Authorize the session
        const { body, status } = await session.authorize();

        return new Response(body, { status });
    } catch (error) {
        console.error("Liveblocks auth error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}