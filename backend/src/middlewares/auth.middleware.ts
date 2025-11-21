import { Request, Response, NextFunction } from "express";
import { verify, type Secret } from "jsonwebtoken";
import { ENV } from "../config/env";
import { JwtUserPayload, UserRole } from "../types/auth.types";

// Middleware: Require user to be logged in (token required)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = auth.slice(7);
  const secret: Secret = ENV.JWT_SECRET;

  try {
    const decoded = verify(token, secret) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Middleware: Allow only specific roles (admin / alumni)
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
