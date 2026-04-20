import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';

export function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next({
        statusCode: 400,
        message: 'Validation failed',
        details: parsed.error.flatten(),
      });
    }
    req.body = parsed.data;
    return next();
  };
}
