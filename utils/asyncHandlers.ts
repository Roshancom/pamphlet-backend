// middleware/asyncHandler.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';

// Define async function type
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

// Async handler wrapper
export const asyncHandler = (fn: AsyncFunction): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
