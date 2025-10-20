import { db } from "@/db";
import { documents, users } from "@/db/schema";

export async function POST() {

    let dsDocuments = await db.select().from(documents);

    return new Response(JSON.stringify(dsDocuments), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

