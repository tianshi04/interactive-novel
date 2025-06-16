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

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Không có token xác thực hoặc token không hợp lệ.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwt.secret) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (error) {
    throw new ApiError(401, 'Token không hợp lệ hoặc đã hết hạn.');
  }
};