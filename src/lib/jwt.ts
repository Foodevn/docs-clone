import { SignJWT, jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

// Chuyển đổi secret string thành Uint8Array
const getSecretKey = () => new TextEncoder().encode(SECRET);

/**
 * JWT Payload Interface
 */
export interface JWTPayload {
    userId?: string;
    id?: string;
    email?: string;
    role?: string;
    exp?: number;
    iat?: number;
    nbf?: number;
    [key: string]: unknown;
}

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
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload as JWTPayload;
    } catch (err) {
        console.error("Lỗi xác thực token:", err);
        return null;
    }
}

/**
 * Kiểm tra xem token có sắp hết hạn không (trong vòng X giây)
 */
export async function isTokenExpiringSoon(token: string, thresholdSeconds: number = 300): Promise<boolean> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        const exp = payload.exp as number;
        const now = Math.floor(Date.now() / 1000);
        return (exp - now) < thresholdSeconds;
    } catch {
        return true; // Token không hợp lệ → coi như đã hết hạn
    }
}

// /**
//  * Lấy thời gian còn lại của token (giây)
//  */
// export async function getTokenTimeRemaining(token: string): Promise<number | null> {
//     try {
//         const { payload } = await jwtVerify(token, getSecretKey());
//         const exp = payload.exp as number;
//         const now = Math.floor(Date.now() / 1000);
//         return Math.max(0, exp - now);
//     } catch {
//         return null;
//     }
// }

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
