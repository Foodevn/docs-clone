import { db } from "@/db";
import { documents, userOrganizations } from "@/db/schema";
import { eq, inArray, and, like } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { userId, search } = await request.json();

        if (!userId) {
            return new Response(JSON.stringify({ error: "userId is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Bước 1: Lấy danh sách organizationId mà user là thành viên
        const userOrgs = await db
            .select({ organizationId: userOrganizations.organizationId })
            .from(userOrganizations)
            .where(eq(userOrganizations.userId, userId));

        // Nếu user không thuộc organization nào
        if (userOrgs.length === 0) {
            return new Response(JSON.stringify([]), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Lấy danh sách organizationId
        const orgIds = userOrgs.map(org => org.organizationId);

        // Bước 2: Lấy tất cả documents thuộc các organizations đó
        let query = db
            .select()
            .from(documents)
            .where(inArray(documents.organizationId, orgIds));

        // Nếu có search, thêm điều kiện tìm kiếm theo title
        if (search && search.trim() !== "") {
            query = db
                .select()
                .from(documents)
                .where(
                    and(
                        inArray(documents.organizationId, orgIds),
                        like(documents.title, `%${search}%`)
                    )
                );
        }

        const dsDocuments = await query;

        return new Response(JSON.stringify(dsDocuments), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch documents" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

