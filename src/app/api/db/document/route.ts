import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents, organizations } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';


// -----------------------------
// 📋 LẤY DANH SÁCH TẤT CẢ DOCUMENTS
// -----------------------------
export async function GET(req: NextRequest) {
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

        // Lấy organizationId từ query params (nếu có)
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get("organizationId");
        const search = searchParams.get("search");

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

        // Lấy dữ liệu từ body
        const body = await req.json();
        const { title, initialContent, organizationId } = body;

        // Validate required fields
        if (!organizationId || !title) {
            return NextResponse.json(
                { error: "organizationId and title are required" },
                { status: 400 }
            );
        }

        //kiểm tra organizationId có tồn tại không
        const existingOrganization = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, organizationId))
            .limit(1);

        if (!existingOrganization) {
            return NextResponse.json(
                { error: "organization isnot existing" },
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


