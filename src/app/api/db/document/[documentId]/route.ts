import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';

export async function GET(
    req: Request,
    context: { params: Promise<{ organizationId: string }> }
) {
    // Verify token
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized - No token provided111" },
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

    const { organizationId } = await context.params;
    console.log(organizationId);

    return NextResponse.json({
        message: "OK",
        organizationId
    });
}


// -----------------------------
// 🗑️ XÓA DOCUMENT
// -----------------------------
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ documentId: string }> }
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
        const { documentId } = await context.params;
        console.log(documentId);

        if (!documentId) {
            return NextResponse.json(
                { error: "Document id is required" },
                { status: 400 }
            );
        }

        // Kiểm tra document có tồn tại không
        const existingDocument = await db
            .select()
            .from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);

        if (existingDocument.length === 0) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // Xóa document
        await db.delete(documents).where(eq(documents.id, documentId));

        return NextResponse.json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json(
            { error: "Failed to delete document" },
            { status: 500 }
        );
    }
}











