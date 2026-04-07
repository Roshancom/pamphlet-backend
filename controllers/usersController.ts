import { Request, Response } from 'express';

import { SUCCESS } from '../constants/result.constants.js';
import {
  deleteUser,
  getUsers,
  getUsersById,
  updateUser,
} from '../services/users.services.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { errorSuccessMessage, successResponse } from '../utils/helpers.js';

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

export const updateUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email } = req.body;
    await updateUser(Number(id), { name, email });
    errorSuccessMessage({
      res,
      status: 200,
      type: SUCCESS,
      message: 'User updated successfully.',
    });
  },
);

export const deleteUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteUser(Number(id));
    errorSuccessMessage({
      res,
      status: 200,
      type: SUCCESS,
      message: 'User updated successfully.',
    });
  },
);
