import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/db";
import { users, userOrganizations, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const access = req.cookies.get("access_token")?.value;

        if (!access) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(access);

        if (!payload || !payload.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Get user information from database
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, payload.id))
            .limit(1);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get user's organizations
        const userOrgs = await db
            .select({
                id: organizations.id,
                name: organizations.name,
                description: organizations.description,
                role: userOrganizations.role,
                createdAt: userOrganizations.joinedAt,
            })
            .from(userOrganizations)
            .innerJoin(organizations, eq(userOrganizations.organizationId, organizations.id))
            .where(eq(userOrganizations.userId, payload.id));

        return NextResponse.json({
            user: {
                ...user,
                createdAt: user.createdAt.toISOString(),
            },
            organizations: userOrgs.map(org => ({
                ...org,
                createdAt: org.createdAt.toISOString(),
            }))
        }, { status: 200 });
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const access = req.cookies.get("access_token")?.value;

        if (!access) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(access);

        if (!payload || !payload.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (name === undefined) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Update user name
        await db
            .update(users)
            .set({
                name: name.trim() || null,
                updatedAt: new Date()
            })
            .where(eq(users.id, payload.id));

        // Get updated user
        const [updatedUser] = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, payload.id))
            .limit(1);

        return NextResponse.json({
            user: {
                ...updatedUser,
                createdAt: updatedUser.createdAt.toISOString(),
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
