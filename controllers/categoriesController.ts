import { Response } from 'express';
import pool from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { RowDataPacket } from 'mysql2';

interface Category extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export const getAllCategories = asyncHandler(
  async (_, res: Response): Promise<void> => {
    const connection = await pool.getConnection();

    const [categories] = await connection.query<Category[]>(
      `SELECT id, name, slug, created_at
       FROM categories
       ORDER BY name ASC`,
    );

    connection.release();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  },
);
