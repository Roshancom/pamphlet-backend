import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { errorSuccessMessage } from '../utils/helpers.js';
import { ERROR } from '../constants/result.constants.js';

export const validationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    const validationErrors = result.error?.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    if (!result.success) {
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
