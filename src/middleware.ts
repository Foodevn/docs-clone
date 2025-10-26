import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, signToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
    const access = req.cookies.get("access_token")?.value;
    const refresh = req.cookies.get("refresh_token")?.value;
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // Các route công khai — không cần xác thực
    const publicPaths = ["/sign-in", "/sign-up", "/api/login", "/api/register", "/api/refresh", "/static", "/favicon.ico"];
    // Nếu path khớp với route công khai → bỏ qua middleware
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Không có access token → thử refresh hoặc redirect
    if (!access) {
        if (refresh) {
            const refreshPayload = await verifyToken(refresh);
            if (refreshPayload) {
                // Tự động tạo access token mới từ refresh token
                const newAccess = await signToken({ id: refreshPayload.id }, "15m");
                const response = NextResponse.next();
                response.cookies.set("access_token", newAccess, { httpOnly: true, path: "/" });
                return response;
            }
        }
        console.warn("Không có access token hợp lệ, chuyển hướng về /sign-in");
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    // Xác thực access token
    const payload = await verifyToken(access);

    if (!payload) {
        // Token không hợp lệ → thử refresh
        if (refresh) {
            const refreshPayload = await verifyToken(refresh);
            if (refreshPayload) {
                const newAccess = await signToken({ id: refreshPayload.id }, "15m");
                const response = NextResponse.next();
                response.cookies.set("access_token", newAccess, { httpOnly: true, path: "/" });
                return response;
            }
        }
        console.warn("Token hết hạn và không thể refresh, chuyển hướng về /sign-in");
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    // Token hợp lệ nhưng sắp hết hạn → tự động refresh ngầm
    // const expiringSoon = await isTokenExpiringSoon(access, 300); // 5 phút
    // if (expiringSoon && refresh) {
    //     const refreshPayload = await verifyToken(refresh);
    //     if (refreshPayload) {
    //         const newAccess = await signToken({ id: refreshPayload.id }, "15m");
    //         const response = NextResponse.next();
    //         response.cookies.set("access_token", newAccess, { httpOnly: true, path: "/" });
    //         return response;
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|static|favicon.ico|public).*)"],
    // Áp dụng cho tất cả route trừ static & file công khai
};
