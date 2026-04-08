import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ERROR } from '../constants/result.constants.js';
import { errorSuccessMessage } from '../utils/helpers.js';

export const validationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const validationErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      errorSuccessMessage({
        res,
        status: 422,
        message: 'Validation failed',
        errors: validationErrors,
        type: ERROR,
      });
    }

    req.body = result.data;
    next();
  };
};
