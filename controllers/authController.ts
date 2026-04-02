import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { UnAuthorizedException } from '../types/errors.js';
import { ApiResponse, User, UserPayload } from '../types/index.js';
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

    // Check if user already exists
    const connection = await pool.getConnection();
    const [existingUser] = await connection.query<User[]>(
      'SELECT id FROM users WHERE email = ?',
      [email],
    );

    console.log({ existingUser });

    if (existingUser.length > 0) {
      connection.release();

      throw new UnAuthorizedException('Email already registered.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
    );

    connection.release();

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

    // Get user from database
    const connection = await pool.getConnection();
    const [users] = await connection.query<User[]>(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email],
    );

    connection.release();

    const user = users?.[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || '', //handle undefined user case by providing empty string to compare
    );

    if (!isPasswordValid || !user) {
      throw new UnAuthorizedException('Invalid email or password.');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
    );

    const response = {
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    successResponse(res, 200, response, 'Login successful.');
  },
);
