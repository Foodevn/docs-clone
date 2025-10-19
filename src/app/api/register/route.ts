import { db } from "@/db/index";
import { organizations, userOrganizations, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    if (!email || !password)
        return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0)
        return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    await db.insert(users).values({ email, passwordHash: hashed, name });

    const user = await db.select().from(users).where(eq(users.email, email)).then((res) => res[0]);
    if (user) {
        await createDefaultOrganizationForUser(user.id);
    }

    return NextResponse.json({ message: "Đăng ký thành công" });
}

//tạo 1 organization mặc định cho user mới đăng ký
//và gán user đó làm admin của organization đó
const createDefaultOrganizationForUser = async (userId: string) => {
    // 1. Tạo organization và lấy id
    const [org] = await db
        .insert(organizations)
        .values({ name: "Default Organization" })
        .returning({ id: organizations.id });

    // 2. Tạo record trong bảng userOrganizations
    await db.insert(userOrganizations).values({
        userId,
        organizationId: org.id,
        role: "admin"
    });

    return org; // có thể return org.id hoặc toàn bộ org tùy bạn
};

