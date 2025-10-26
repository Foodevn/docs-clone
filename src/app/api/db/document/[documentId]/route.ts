import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";
import { cookies } from 'next/headers';

// ✅ Type for partial document update
type DocumentUpdate = Partial<Pick<typeof documents.$inferInsert, 'title' | 'initialContent'>> & {
    updatedAt: Date;
};

export async function GET(

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

    // const { documentId } = await context.params;



    return NextResponse.json({
        message: "OK",

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

// -----------------------------
// ✏️ CẬP NHẬT DOCUMENT
// -----------------------------
export async function PUT(
    req: NextRequest,
    context: {
        params: Promise<{ documentId: string }>
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
        const { documentId } = await context.params;

        // Lấy dữ liệu từ body
        const body = await req.json();
        const { title } = body.updated;

        // Validate required fields
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

        // Cập nhật document
        const updateData: DocumentUpdate = {
            updatedAt: new Date(),
        };

        if (title !== undefined) {
            updateData.title = title;
        }

        const updatedDocument = await db
            .update(documents)
            .set(updateData)
            .where(eq(documents.id, documentId))
            .returning();

        return NextResponse.json({
            success: true,
            data: updatedDocument[0],
            message: "Document updated successfully",
        });

    } catch (error) {
        console.error("Error updating document:", error);
        return NextResponse.json(
            { error: "Failed to update document" },
            { status: 500 }
        );
    }
}











