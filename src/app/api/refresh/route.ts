import { db } from "@/db/index";
import { refreshTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken, signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("refresh_token")?.value;

    if (!refresh) return NextResponse.json({ error: "Không có refresh token" }, { status: 401 });

    const payload = verifyToken(refresh);
    if (!payload) return NextResponse.json({ error: "Token không hợp lệ" }, { status: 403 });

    const dbToken = (await db.select().from(refreshTokens).where(eq(refreshTokens.token, refresh)))[0];
    if (!dbToken || dbToken.revoked) return NextResponse.json({ error: "Token đã bị thu hồi" }, { status: 403 });

    const newAccess = signToken({ id: payload.id }, "15m");

    const res = NextResponse.json({ accessToken: newAccess });
    res.cookies.set("access_token", newAccess, { httpOnly: true });
    return res;
}
