import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import {
  UserPayload,
  User,
  LoginResponse,
  ApiResponse,
} from '../types/index.js';
import { RowDataPacket } from 'mysql2/promise';
import { successResponse } from '../utils/helpers.js';
import { asyncHandler } from '../utils/asyncHandlers.js';

/**
 * Register a new user
 * @param req - Express Request with user registration data
 * @param res - Express Response
 */
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password }: UserPayload = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
      return;
    }

    // Check if user already exists
    const connection = await pool.getConnection();
    const [existingUser] = await connection.query<User[]>(
      'SELECT id FROM users WHERE email = ?',
      [email],
    );

    if ((existingUser as RowDataPacket[]).length > 0) {
      connection.release();
      res.status(400).json({
        success: false,
        message: 'Email already registered.',
      });
      return;
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

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
      return;
    }

    // Get user from database
    const connection = await pool.getConnection();
    const [users] = await connection.query<User[]>(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email],
    );

    connection.release();

    const usersList = users as RowDataPacket[];

    if (usersList.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const user = usersList[0] as User;

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
    );

    const response: LoginResponse = {
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    res.status(200).json(response);
  },
);
