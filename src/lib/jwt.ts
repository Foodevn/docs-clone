import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * Tạo JWT token
 */
export function signToken(payload: object, expiresIn: string = "1h") {
    const options: SignOptions = { expiresIn: expiresIn as any };
    return jwt.sign(payload, SECRET as string, options);
}

/**
 * Xác thực và giải mã JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, SECRET as string) as JwtPayload;
    } catch (err) {
        console.error("Lỗi xác thực token:", err);
        return null;
    }
}
