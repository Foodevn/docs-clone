import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Không có access token" }, { status: 401 });
    }

    const payload = await verifyToken(accessToken);
    if (!payload) {
        return NextResponse.json({ error: "Token không hợp lệ" }, { status: 403 });
    }

    const user = (await db.select().from(users).where(eq(users.id, payload.id)))[0];
    if (!user) {
        return NextResponse.json({ error: "Không tìm thấy user" }, { status: 404 });
    }

    // Trả về thông tin user (nên loại bỏ các trường nhạy cảm)
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser);
}