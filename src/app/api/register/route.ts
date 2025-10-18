import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    if (!email || !password)
        return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0)
        return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    await db.insert(users).values({ email, passwordHash: hashed, name });

    return NextResponse.json({ message: "Đăng ký thành công" });
}
