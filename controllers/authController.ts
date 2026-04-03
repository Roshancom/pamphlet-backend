import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.services.js';
import { ApiResponse, UserPayload } from '../types/index.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { successResponse } from '../utils/helpers.js';

/**
 * Register a new user
 * @param req - Express Request with user registration data
 * @param res - Express Response
 */
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password }: UserPayload = req.body;
    await registerUser(name, email, password);

    const response: ApiResponse<null> = {
      success: true,
      message: 'User registered successfully.',
    };

    successResponse(res, 201, response, 'User registered successfully.');
  },
);

/**
 * Login a user and return JWT token
 * @param req - Express Request with login credentials
 * @param res - Express Response
 */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: UserPayload = req.body;

    const result = await loginUser(email, password);

    successResponse(res, 200, result, 'Login successful.');
  },
);
