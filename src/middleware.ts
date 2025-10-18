import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { env } from "process";

export function middleware(req: NextRequest) {
    const access = req.cookies.get("access_token")?.value;
    const url = req.nextUrl.clone();

    if (url.pathname.startsWith("/protected")) {
        if (!access) {
            console.log("lỗi 1");
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        }
        const valid = verifyToken(access);
        if (!valid) {
            console.log(`lỗi 2: ${access}`);
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};
