import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizations, userOrganizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';

export async function GET() {
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
        const userId = (payload?.userId || payload?.id) as string;

        if (!payload || !userId) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }

        //lấy danh sách organization theo userid trong bảng user-organization
        const userOrganizationsDS = await db
            .select()
            .from(userOrganizations)
            .innerJoin(organizations, eq(organizations.id, userOrganizations.organizationId))
            .where(eq(userOrganizations.userId, userId))

        return NextResponse.json({
            userOrganizationsDS
        });

    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}

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
        const userId = (payload?.userId || payload?.id) as string;

        if (!payload || !userId) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }

        // Lấy dữ liệu từ body
        const body = await req.json();
        const { name, description } = body;

        // Validate required fields
        if (!name.trim()) {
            return NextResponse.json(
                { error: "name is required" },
                { status: 400 }
            );
        }

        // Tạo organization mới
        const newOrganization = await db
            .insert(organizations)
            .values({
                name,
                description: description || "",
            })
            .returning();

        //tạo userOrganization mới
        const newUserOrganization = await db
            .insert(userOrganizations)
            .values({
                userId: userId, // ✅ Sử dụng userId đã validate
                organizationId: newOrganization[0].id,
                role: "Admin"
            })
            .returning();

        return NextResponse.json({
            success: true,
            data: newUserOrganization[0],
            message: "Organization created successfully",
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating organization:", error);
        return NextResponse.json(
            { error: "Failed to create organization" },
            { status: 500 }
        );
    }
}

