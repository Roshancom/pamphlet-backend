/**
 * Generic API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Error response
 */
export interface ErrorResponse {
  success: false;
  message: string;
  additional?: unknown;
}

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
