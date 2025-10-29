import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = randomUUID();
  res.setHeader('x-request-id', id);
  (req as any).requestId = id;
  next();
}
