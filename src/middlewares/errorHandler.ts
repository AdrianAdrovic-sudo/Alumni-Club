// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // Loguj detalje greške
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  const status = err.status || 500;
  const message =
    status === 500
      ? 'Došlo je do nepredviđene greške na serveru.'
      : err.message || 'Greška u zahtevu.';

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
}
