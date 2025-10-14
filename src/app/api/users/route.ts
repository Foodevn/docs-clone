import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const data = await db.select().from(users);

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();
    await db.insert(users).values({
        name: body.name,
        email: body.email,
    });
    return NextResponse.json({ success: true });
}
