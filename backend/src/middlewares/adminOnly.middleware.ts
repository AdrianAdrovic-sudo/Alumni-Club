import { Request, Response, NextFunction } from "express";

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  // authenticate middleware should already attach req.user
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden (admin only)" });
  }

  next();
}
