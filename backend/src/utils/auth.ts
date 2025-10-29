import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET: Secret = (process.env.JWT_SECRET || "dev_secret") as Secret;
// 1h u sekundama
const JWT_EXPIRES_IN_SECONDS = Number(process.env.JWT_EXPIRES_IN ?? 3600);

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePasswords(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(payload: object, options?: SignOptions) {
  const opts: SignOptions = {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
    ...(options || {}),
  };
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return typeof decoded === "string"
      ? ({ sub: decoded } as JwtPayload)
      : (decoded as JwtPayload);
  } catch {
    return null;
  }
}
