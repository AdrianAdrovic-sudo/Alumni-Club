import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  (req as any).user = decoded;
  next();
}
