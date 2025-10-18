import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
    const access = req.cookies.get("access_token")?.value;
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // Các route công khai — không cần xác thực
    const publicPaths = ["/sign-in", "/sign-up", "/api/login", "/api/register", "/static", "/favicon.ico"];

    // Nếu path khớp với route công khai → bỏ qua middleware
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    if (!access) {
        console.warn("Không có access token, chuyển hướng về /sign-in");
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    const payload = await verifyToken(access);

    if (!payload) {
        console.warn("Token hết hạn hoặc không hợp lệ:", access);
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|static|favicon.ico|public).*)"],
    // Áp dụng cho tất cả route trừ static & file công khai
};
