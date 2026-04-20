import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'ADMIN' | 'EMPLOYEE';
        email: string;
      };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next({ statusCode: 401, message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next({ statusCode: 401, message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: Array<'ADMIN' | 'EMPLOYEE'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({ statusCode: 401, message: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return next({ statusCode: 403, message: 'Forbidden' });
    }
    return next();
  };
}
