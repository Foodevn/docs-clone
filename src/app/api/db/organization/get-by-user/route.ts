import { db } from "@/db";
import { userOrganizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return new Response(JSON.stringify({ error: "userId is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Lấy danh sách organizations của user
        const organizations = await db
            .select()
            .from(userOrganizations)
            .where(eq(userOrganizations.userId, userId));

        return new Response(JSON.stringify(organizations), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching organizations:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch organizations" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
