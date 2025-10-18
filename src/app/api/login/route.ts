import { db } from "@/db/index";
import { users, refreshTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = (await db.select().from(users).where(eq(users.email, email)))[0];
    if (!user)
        return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
        return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });

    const accessToken = signToken({ id: user.id, email: user.email }, "15m");
    const refreshToken = signToken({ id: user.id }, "7d");

    await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const res = NextResponse.json({ message: "Đăng nhập thành công" });
    res.cookies.set("access_token", accessToken, { httpOnly: true });
    res.cookies.set("refresh_token", refreshToken, { httpOnly: true, path: "/" });
    return res;
}
