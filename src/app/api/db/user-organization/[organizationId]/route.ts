import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userOrganizations } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';

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
            .from(userOrganizations)
            .where(eq(userOrganizations.organizationId, organizationId))
            .limit(1);

        if (existingOrg.length === 0) {
            return NextResponse.json(
                { error: "Org not found" },
                { status: 404 }
            );
        }

        // Xóa Org
        await db.delete(userOrganizations).where(eq(userOrganizations.organizationId, userOrganizations));

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