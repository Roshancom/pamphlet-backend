import { RowDataPacket } from 'mysql2/promise';

/**
 * User interface representing a user in the database.
 */
export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

/**
 * User payload for registration and login requests
 */
export interface UserPayload {
  name?: string;
  email: string;
  password: string;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * User response (without sensitive data)
 */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}
