import type { ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Neispravan unos.',
          details: result.error.flatten()
        }
      });
    }
    next();
  };
