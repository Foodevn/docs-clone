import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents, userOrganizations, organizations } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
    try {
        // Get and verify JWT token
        const token = request.cookies.get("access_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload || !payload.id) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        const userId = payload.id as string;

        // Get user's organizations
        const userOrgs = await db
            .select({
                organizationId: userOrganizations.organizationId,
            })
            .from(userOrganizations)
            .where(eq(userOrganizations.userId, userId));

        const organizationIds = userOrgs.map(org => org.organizationId);

        // If user has no organizations, return empty stats
        if (organizationIds.length === 0) {
            return NextResponse.json({
                totalDocuments: 0,
                personalDocuments: 0,
                organizationDocuments: 0,
                totalOrganizations: 0,
                documentsToday: 0,
                documentsThisWeek: 0,
                documentsThisMonth: 0,
                recentActivity: [],
                documentsByOrganization: [],
                documentTrend: []
            });
        }

        // Get all documents from user's organizations
        const allDocuments = await db
            .select()
            .from(documents)
            .where(sql`${documents.organizationId} IN (${sql.join(organizationIds.map(id => sql`${id}`), sql`, `)})`)
            .orderBy(desc(documents.createdAt));

        // Calculate stats
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const documentsToday = allDocuments.filter(
            doc => new Date(doc.createdAt) >= todayStart
        );

        const documentsThisWeek = allDocuments.filter(
            doc => new Date(doc.createdAt) >= weekStart
        );

        const documentsThisMonth = allDocuments.filter(
            doc => new Date(doc.createdAt) >= monthStart
        );

        // Get recent activity (last 10 documents)
        const recentActivity = allDocuments.slice(0, 10).map(doc => ({
            id: doc.id,
            title: doc.title,
            action: 'Tạo tài liệu',
            date: doc.createdAt.toISOString(),
        }));

        // Get documents by organization
        const orgDocumentCounts = new Map<string, { name: string; count: number }>();

        for (const doc of allDocuments) {
            if (!orgDocumentCounts.has(doc.organizationId)) {
                // Get organization name
                const [org] = await db
                    .select({ name: organizations.name })
                    .from(organizations)
                    .where(eq(organizations.id, doc.organizationId))
                    .limit(1);

                orgDocumentCounts.set(doc.organizationId, {
                    name: org?.name || 'Unknown',
                    count: 0
                });
            }
            const current = orgDocumentCounts.get(doc.organizationId)!;
            orgDocumentCounts.set(doc.organizationId, {
                ...current,
                count: current.count + 1
            });
        }

        const documentsByOrganization = Array.from(orgDocumentCounts.values()).map(org => ({
            organizationName: org.name,
            count: org.count
        }));

        // Get document trend (last 7 days)
        const documentTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

            const count = allDocuments.filter(
                doc => new Date(doc.createdAt) >= dateStart && new Date(doc.createdAt) < dateEnd
            ).length;

            documentTrend.push({
                date: dateStart.toISOString(),
                count
            });
        }

        return NextResponse.json({
            totalDocuments: allDocuments.length,
            personalDocuments: 0, // Not applicable in current schema
            organizationDocuments: allDocuments.length,
            totalOrganizations: organizationIds.length,
            documentsToday: documentsToday.length,
            documentsThisWeek: documentsThisWeek.length,
            documentsThisMonth: documentsThisMonth.length,
            recentActivity,
            documentsByOrganization,
            documentTrend
        });

    } catch (error) {
        console.error("Error fetching report stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
