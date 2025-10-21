import { db } from "@/db";
import { documents } from "@/db/schema";

export async function POST(request: Request) {
    try {
        const { title, initialContent, organizationId } = await request.json();

        if (!title) {
            return new Response(JSON.stringify({ error: "Title is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (organizationId == "") {
            return new Response(JSON.stringify({ error: "OrganizationId is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Tạo document mới
        const [newDocument] = await db
            .insert(documents)
            .values({
                title,
                initialContent: initialContent || "",
                organizationId,
            })
            .returning({ id: documents.id });

        return new Response(JSON.stringify({
            id: newDocument.id,
            message: "Document created successfully"
        }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error creating document:", error);
        return new Response(JSON.stringify({ error: "Failed to create document" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

