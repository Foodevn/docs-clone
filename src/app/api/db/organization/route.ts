import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizations, userOrganizations } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

import { cookies } from 'next/headers';

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

        //lấy danh sách organnization theo userid trong bảng user-organization
        let userOrganizationsDS = await db
            .select()
            .from(userOrganizations)
            .innerJoin(organizations, eq(organizations.id, userOrganizations.organizationId))
            .where(eq(userOrganizations.userId, payload.id))

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
        if (!payload) {
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
                { error: "name and title are required" },
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

        //tạo useOrganization mới
        const newUseOrganization = await db
            .insert(userOrganizations)
            .values({
                userId: payload.id,
                organizationId: newOrganization[0].id,
                role: "Admin"
            })
            .returning();

        return NextResponse.json({
            success: true,
            data: newUseOrganization[0],
            message: "Document created successfully",
        }, { status: 201 });


    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}