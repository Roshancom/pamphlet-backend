import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { UnAuthorizedException } from '../types/errors.js';
import { JwtPayload } from '../types/index.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to request
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  try {
    let token: string | undefined;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    const decoded = jwt.verify(
      token || '',
      process.env.JWT_SECRET || 'your-secret-key',
    ) as JwtPayload;

    req.user = decoded;
    next();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    next(new UnAuthorizedException('Invalid or expired token.'));
  }
};

export default authMiddleware;
