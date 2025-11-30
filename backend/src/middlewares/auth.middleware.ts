import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthJwtPayload {
  sub?: number;
  userId?: number;
  email?: string;
  role?: string;
  username?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // jwt.verify returns string | jwt.JwtPayload
    const decodedRaw = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decodedRaw === "string") {
      // Shouldn't happen with our tokens, but be safe
      return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = decodedRaw as AuthJwtPayload;

    const userId = decoded.sub ?? decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token: no user ID" });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, is_active: true },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role || "user",
    };

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("Auth middleware error: token expired at", error.expiredAt);
      return res.status(401).json({ message: "Token expired" });
    }

    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
