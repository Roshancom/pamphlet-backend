// utils/response.ts

import { Response } from 'express';

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

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): boolean => {
  return !!password && password.length >= 6;
};

// Payload validation result type
interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

// Payload type (dynamic object)
type Payload = Record<string, unknown>;

// Request payload validator
export const validatePayload = (
  payload: Payload,
  requiredFields: string[],
): ValidationResult => {
  const missingFields = requiredFields.filter((field) => !payload[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};
