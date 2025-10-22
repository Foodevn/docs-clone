import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';



// -----------------------------
// 📋 LẤY DANH SÁCH TẤT CẢ DOCUMENTS
// -----------------------------
export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        // Verify token

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

        // Lấy organizationId từ query params (nếu có)
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get("organizationId");
        const search = searchParams.get("search");

        console.log(organizationId, search)
        // Nếu có organizationId, lọc theo organization
        let allDocuments;
        if (organizationId) {
            allDocuments = await db
                .select()
                .from(documents)
                .where(eq(documents.organizationId, organizationId))
                .orderBy(desc(documents.updatedAt));
        } else {
            allDocuments = await db
                .select()
                .from(documents)
                .orderBy(desc(documents.updatedAt));
        }

        if (search)
            allDocuments = allDocuments.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

        return NextResponse.json({

            allDocuments
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}

// -----------------------------
// ➕ TẠO DOCUMENT MỚI
// -----------------------------
export async function POST(req: NextRequest) {
    try {
        // Verify token
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
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

        // Lấy dữ liệu từ body
        const body = await req.json();
        const { organizationId, title, initialContent } = body;

        // Validate required fields
        if (!organizationId || !title) {
            return NextResponse.json(
                { error: "organizationId and title are required" },
                { status: 400 }
            );
        }

        // Tạo document mới
        const newDocument = await db
            .insert(documents)
            .values({
                organizationId,
                title,
                initialContent: initialContent || "",
            })
            .returning();

        return NextResponse.json({
            success: true,
            data: newDocument[0],
            message: "Document created successfully",
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating document:", error);
        return NextResponse.json(
            { error: "Failed to create document" },
            { status: 500 }
        );
    }
}

// -----------------------------
// ✏️ CẬP NHẬT DOCUMENT
// -----------------------------
export async function PUT(req: NextRequest) {
    try {
        // Verify token
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
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

        // Lấy dữ liệu từ body
        const body = await req.json();
        const { id, title, initialContent } = body;

        // Validate required fields
        if (!id) {
            return NextResponse.json(
                { error: "Document id is required" },
                { status: 400 }
            );
        }

        // Kiểm tra document có tồn tại không
        const existingDocument = await db
            .select()
            .from(documents)
            .where(eq(documents.id, id))
            .limit(1);

        if (existingDocument.length === 0) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // Cập nhật document
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (title !== undefined) {
            updateData.title = title;
        }

        if (initialContent !== undefined) {
            updateData.initialContent = initialContent;
        }

        const updatedDocument = await db
            .update(documents)
            .set(updateData)
            .where(eq(documents.id, id))
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

// -----------------------------
// 🗑️ XÓA DOCUMENT
// -----------------------------
export async function DELETE(req: NextRequest) {
    try {
        // Verify token
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
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
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Document id is required" },
                { status: 400 }
            );
        }

        // Kiểm tra document có tồn tại không
        const existingDocument = await db
            .select()
            .from(documents)
            .where(eq(documents.id, id))
            .limit(1);

        if (existingDocument.length === 0) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // Xóa document
        await db.delete(documents).where(eq(documents.id, id));

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
