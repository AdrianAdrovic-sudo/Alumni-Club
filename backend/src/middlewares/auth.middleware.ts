import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  sub: number;        // Changed from userId to sub
  email: string;
  role: string;
  username?: string;  // Add this since it's in your token
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

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.sub || decoded.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: no user ID' });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, is_active: true }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
// Admin authorization middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};