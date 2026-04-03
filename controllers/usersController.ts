import { Request, Response } from 'express';

import { getUsers, getUsersById } from '../services/users.services.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { successResponse } from '../utils/helpers.js';

export const getUsersHandler = asyncHandler(
  async (_: Request, res: Response) => {
    const result = await getUsers();
    successResponse(res, 200, result, 'User retrieved successfully.');
  },
);

export const getUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await getUsersById(Number(id));
    successResponse(res, 200, result, 'User retrieved successfully.');
  },
);
