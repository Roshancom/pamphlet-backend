import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { UnAuthorizedException } from '../types/errors.js';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const protect = (
  req: AuthRequest,
  _: Response,
  next: NextFunction,
): void => {
  let token: string | undefined;

  // Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token
  if (!token) {
    throw new UnAuthorizedException();
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
    id: number;
    name: string;
    email: string;
  };

  // Attach user to request
  req.user = decoded;

  next();
};
