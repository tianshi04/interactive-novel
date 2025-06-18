// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ApiError } from '../utils/errors';

// Mở rộng interface Request của Express để thêm thuộc tính userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication token is missing or invalid.');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Dùng ACCESS_TOKEN_SECRET để xác minh
    const payload = jwt.verify(token, config.jwt.accessTokenSecret) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Access token has expired.');
    }
    throw new ApiError(401, 'Invalid access token.');
  }
};