import { Request, Response } from 'express';

import { asyncHandler } from '../utils/asyncHandlers.js';
import pool from '../config/db.js';
import { successResponse } from '../utils/helpers.js';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  const [users] = await connection.query(
    'SELECT id, name, email, created_at FROM users',
  );
  connection.release();

  successResponse(res, 200, users, 'Users retrieved successfully.');
});

export const getUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id],
    );
    connection.release();
    successResponse(res, 200, users, 'User retrieved successfully.');
  },
);
