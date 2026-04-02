import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { UnprocessableEntityException } from '../types/errors.js';

export const validationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    const validationErrors = result.error?.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    console.log('Validation result:', validationErrors);

    // if (!result.success) {
    //   throw new UnprocessableEntityException(validationErrors);
    // }
    // Attach validated data
    req.body = result.data;
    next();
  };
};
