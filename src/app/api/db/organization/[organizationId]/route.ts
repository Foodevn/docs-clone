import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizations, userOrganizations, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';

export async function GET(
    req: NextRequest,
    context: {
        params: Promise<{ organizationId: string }>
    }) {
    try {
        // Verify token
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }
        // Lấy id từ query params
        const { organizationId } = await context.params;

        // Validate required fields
        if (!organizationId) {
            return NextResponse.json(
                { error: "Org id is required" },
                { status: 400 }
            );
        }

        // Kiểm tra Org có tồn tại không
        const organizationDS = await db
            .select()
            .from(userOrganizations)
            .innerJoin(users, eq(users.id, userOrganizations.userId))
            .where(eq(userOrganizations.organizationId, organizationId))


        if (organizationDS.length === 0) {
            return NextResponse.json(
                { error: "Org not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: organizationDS,
            message: "Org get successfully",
        });

    } catch (error) {
        console.error("Error updating Org:", error);
        return NextResponse.json(
            { error: "Failed to update Org" },
            { status: 500 }
        );
    }
}

// -----------------------------
// ✏️ CẬP NHẬT org
// -----------------------------
export async function PUT(
    req: NextRequest,
    context: {
        params: Promise<{ organizationId: string }>
    }) {
    try {
        // Verify token
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }
        // Lấy id từ query params
        const { organizationId } = await context.params;

        // Lấy dữ liệu từ body
        const body = await req.json();
        const { name, description } = body.updated;

        // Validate required fields
        if (!organizationId) {
            return NextResponse.json(
                { error: "Org id is required" },
                { status: 400 }
            );
        }

        // Kiểm tra Org có tồn tại không
        const existingOrganization = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, organizationId))
            .limit(1);

        if (existingOrganization.length === 0) {
            return NextResponse.json(
                { error: "Org not found" },
                { status: 404 }
            );
        }

        // Cập nhật Org
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (name !== undefined) {
            updateData.name = name;
        }
        if (description !== undefined) {
            updateData.description = description;
        }

        const updatedOrg = await db
            .update(organizations)
            .set(updateData)
            .where(eq(organizations.id, organizationId))
            .returning();

        return NextResponse.json({
            success: true,
            data: updatedOrg[0],
            message: "Org updated successfully",
        });

    } catch (error) {
        console.error("Error updating Org:", error);
        return NextResponse.json(
            { error: "Failed to update Org" },
            { status: 500 }
        );
    }
}

// -----------------------------
// 🗑️ XÓA org
// -----------------------------
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ organizationId: string }> }
) {
    try {
        // Verify token
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }

        // Lấy id từ query params
        const { organizationId } = await context.params;


        if (!organizationId) {
            return NextResponse.json(
                { error: "Org id is required" },
                { status: 400 }
            );
        }

        // Kiểm tra Org có tồn tại không
        const existingOrg = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, organizationId))
            .limit(1);

        const existingOrgInuserOrganizations = await db
            .select()
            .from(userOrganizations)
            .where(eq(userOrganizations.organizationId, organizationId))
            .limit(1);

        if (existingOrg.length === 0 || existingOrgInuserOrganizations.length === 0) {
            return NextResponse.json(
                { error: "Org not found" },
                { status: 404 }
            );
        }
        // Xóa tất cả Orgs trong userOrganizations
        await db.delete(userOrganizations).where(eq(userOrganizations.organizationId, organizationId)).then(
            // Xóa Org
            () => db.delete(organizations).where(eq(organizations.id, organizationId))
        );
        return NextResponse.json({
            success: true,
            message: "Org deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting Org:", error);
        return NextResponse.json(
            { error: "Failed to delete Org" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    context: {
        params: Promise<{ organizationId: string }>
    }) {
    try {
        // Verify token
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }
        // Lấy id từ query params
        const { organizationId } = await context.params;

        // Lấy dữ liệu từ body
        const body = await req.json();
        const { email } = body;


        //lấy ra user
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

        // Validate required fields
        if (user.length === 0) {
            return NextResponse.json(
                { error: "Email is not resgister" },
                { status: 400 }
            );
        }

        const newUserOrg = await db
            .insert(userOrganizations)
            .values({
                userId: user[0].id,
                organizationId,
                role: "Member",
            })
            .returning();

        return NextResponse.json({
            success: true,
            data: newUserOrg,
        });

    } catch (error) {
        console.error("Error updating Org:", error);
        return NextResponse.json(
            { error: "Failed to update Org" },
            { status: 500 }
        );
    }
}