import { Response } from 'express';

import { getCategories } from '../services/categories.services.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { successResponse } from '../utils/helpers.js';

export const getAllCategories = asyncHandler(
  async (_, res: Response): Promise<void> => {
    const result = await getCategories();

    successResponse(res, 200, result);
  },
);
