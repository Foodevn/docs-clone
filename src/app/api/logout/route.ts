import { db } from "@/db/index";
import { refreshTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("refresh_token")?.value;

    if (refresh) {
        await db.update(refreshTokens)
            .set({ revoked: true })
            .where(eq(refreshTokens.token, refresh));
    }

    const res = NextResponse.json({ message: "Đăng xuất thành công" });
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return res;
}
