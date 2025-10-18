import { SignJWT, jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

// Chuyển đổi secret string thành Uint8Array
const getSecretKey = () => new TextEncoder().encode(SECRET);

/**
 * Tạo JWT token
 */
export async function signToken(payload: object, expiresIn: string = "1h"): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + parseExpiresIn(expiresIn);

    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(getSecretKey());
}

/**
 * Xác thực và giải mã JWT token
 */
export async function verifyToken(token: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload;
    } catch (err) {
        console.error("Lỗi xác thực token:", err);
        return null;
    }
}

/**
 * Parse expiresIn string thành số giây
 */
function parseExpiresIn(expiresIn: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = expiresIn.match(regex);

    if (!match) {
        return 3600; // mặc định 1 giờ
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 3600;
        case 'd': return value * 86400;
        default: return 3600;
    }
}
