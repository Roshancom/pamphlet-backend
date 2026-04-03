import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger.js';
import { AppError } from '../types/errors.js';
import { ErrorResponse } from '../types/index.js';

/**
 * Global error handling middleware
 * @param err - Error object
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: err.message,
      additional: err.additional,
    };

    logger.error(`Error: ${err.message}`);
    res.status(err.statusCode).json(errorResponse);
  } else {
    const errorResponse: ErrorResponse = {
      success: false,
      message: err.message || 'Server Error',
    };

    logger.error(`Error: ${err.message}`);
    res.status(500).json(errorResponse);
  }
};
