// src/middlewares/notFound.ts
import type { Request, Response } from 'express';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({
    error: { status: 404, message: 'Tražena ruta ne postoji.' }
  });
}
