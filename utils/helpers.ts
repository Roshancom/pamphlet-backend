// utils/response.ts

import { Response } from 'express';
import { ERROR, SUCCESS } from '../constants/index.js';

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Success response
export const successResponse = <T>(
  res: Response,
  status: number = 200,
  data: T,
  message: string = 'Success',
): Response<ApiResponse<T>> => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

// Error response
export const errorResponse = (
  res: Response,
  message: string = 'An error occurred',
  status: number = 500,
): Response<ApiResponse<null>> => {
  return res.status(status).json({
    success: false,
    message,
  });
};

// custom error and success message
export const errorSuccessMessage = ({
  message,
  res,
  status,
  errors,
  type,
}: {
  res: Response;
  status: number;
  type: typeof ERROR | typeof SUCCESS;
  errors?: string | Array<Record<string, string>>;
  message: string;
}): Response<ApiResponse<null>> => {
  return res.status(status).json({
    success: type === SUCCESS ? true : false,
    message,
    ...(type === ERROR ? { errors } : {}),
  });
};
