import { Request, Response } from 'express';
import pool from '../config/db.js';
import {
  Pamphlet,
  PamphletWithAuthor,
  PamphletPayload,
  CountResult,
  ApiResponse,
  PaginatedApiResponse,
} from '../types/index.js';
import { RowDataPacket } from 'mysql2/promise';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { NotFoundException } from '../types/errors.js';
import { successResponse } from 'utils/helpers.js';

/**
 * Get all pamphlets with pagination and filtering
 * Query params: page, limit, category, location
 * @param req - Express Request
 * @param res - Express Response
 */
export const getAllPamphlets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 2;
    const offset = (page - 1) * limit;

    const { category, location } = req.query;

    const connection = await pool.getConnection();

    // Build WHERE clauses dynamically
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    // Category filter (single + multiple)
    if (category) {
      const categories = (category as string).split(',');

      if (categories.length > 1) {
        whereClauses.push(
          `p.category IN (${categories.map(() => '?').join(',')})`,
        );
        params.push(...categories);
      } else {
        whereClauses.push('p.category = ?');
        params.push(categories[0]);
      }
    }

    //Location filter (partial match)
    if (location) {
      whereClauses.push('p.location LIKE ?');
      params.push(`%${location}%`);
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(' AND ')}`
      : '';

    const [countResult] = await connection.query<CountResult[]>(
      `SELECT COUNT(*) as total FROM pamphlets p ${whereSQL}`,
      params,
    );

    const total = (countResult[0] as CountResult).total;

    const [pamphlets] = await connection.query<PamphletWithAuthor[]>(
      `SELECT 
        p.id, 
        p.title, 
        p.short_description, 
        p.image_url, 
        p.category, 
        p.location, 
        p.user_id, 
        p.created_at,
        p.url_key, 
        u.name as author_name
      FROM pamphlets p
      JOIN users u ON p.user_id = u.id
      ${whereSQL}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    connection.release(); // important

    const response: PaginatedApiResponse<PamphletWithAuthor> = {
      success: true,
      data: pamphlets,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    res.status(200).json(response);
  },
);

/**
 * Get a specific pamphlet by ID
 * @param req - Express Request with id param
 * @param res - Express Response
 */
export const getPamphletByUrlKey = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { url_key } = req.params;

    const connection = await pool.getConnection();

    // Fetch main pamphlet info
    const [pamphletResult] = await connection.query<PamphletWithAuthor[]>(
      `SELECT 
         p.id,
         p.title,
         p.content,   
         p.category,
         p.location,
         p.user_id,
         p.url_key,
         p.created_at,
         u.name AS author_name
       FROM pamphlets p
       JOIN users u ON p.user_id = u.id
       WHERE p.url_key = ?`,
      [url_key],
    );

    if ((pamphletResult as RowDataPacket[]).length === 0) {
      connection.release();
      throw new NotFoundException();
    }

    const pamphlet = pamphletResult[0] as PamphletWithAuthor;

    // Fetch images
    const [imagesResult] = await connection.query<
      RowDataPacket[] & { image_url: string }[]
    >(`SELECT image_url FROM pamphlet_images WHERE pamphlet_id = ?`, [url_key]);

    // Fetch contact info
    const [contactResult] = await connection.query<
      RowDataPacket[] &
        {
          phone: string;
          whatsapp: string;
          email: string;
        }[]
    >(
      `SELECT phone, whatsapp, email FROM pamphlet_contacts WHERE pamphlet_id = ?`,
      [url_key],
    );

    const contact = contactResult[0] || null;

    // Fetch store location
    const [locationResult] = await connection.query<
      RowDataPacket[] &
        {
          address: string;
          latitude: number;
          longitude: number;
        }[]
    >(
      `SELECT address, latitude, longitude FROM pamphlet_locations WHERE pamphlet_id = ?`,
      [url_key],
    );

    const store_location = locationResult[0] || null;

    connection.release();

    // Construct response
    const response: ApiResponse<
      PamphletWithAuthor & {
        images: string[];
        contact: { phone: string; whatsapp: string; email: string } | null;
        store_location: {
          address: string;
          latitude: number;
          longitude: number;
        } | null;
      }
    > = {
      success: true,
      data: {
        ...pamphlet,
        images: imagesResult.map((img) => img.image_url),
        contact,
        store_location,
      },
    };

    res.status(200).json(response);
  },
);

/**
 * Create a new pamphlet
 * Requires authentication (req.user must be set)
 * @param req - Express Request with pamphlet data and authenticated user
 * @param res - Express Response
 */
export const createPamphlet = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      title,
      description,
      image_url,
      category,
      location,
      url_key,
    }: PamphletPayload = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    // Validation
    if (!title || !category || !location || !url_key) {
      res.status(400).json({
        success: false,
        message: 'Please provide title, category, location, and URL key.',
      });
      return;
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO pamphlets (title, description, image_url, category, location, user_id, url_key) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        image_url || null,
        category,
        location,
        userId,
        url_key,
      ],
    );

    connection.release();

    const insertResult = result as { insertId: number };

    const response: ApiResponse<{
      id: number;
      title?: string;
      description?: string;
      image_url?: string | null;
      category?: string;
      location?: string;
      user_id: number;
    }> = {
      success: true,
      message: 'Pamphlet created successfully.',
      data: {
        id: insertResult.insertId,
        title,
        description,
        image_url,
        category,
        location,
        user_id: userId,
      },
    };

    res.status(201).json(response);
  },
);

/**
 * Update a pamphlet
 * Requires authentication and ownership
 * @param req - Express Request with id param, pamphlet data, and authenticated user
 * @param res - Express Response
 */
export const updatePamphlet = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      title,
      description,
      image_url,
      category,
      location,
    }: PamphletPayload = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    // Get pamphlet first
    const connection = await pool.getConnection();
    const [pamphlets] = await connection.query<Pamphlet[]>(
      'SELECT user_id FROM pamphlets WHERE id = ?',
      [id],
    );

    if ((pamphlets as RowDataPacket[]).length === 0) {
      connection.release();
      res.status(404).json({
        success: false,
        message: 'Pamphlet not found.',
      });
      return;
    }

    const pamphlet = pamphlets[0] as RowDataPacket as Pamphlet;

    // Check ownership
    if (pamphlet.user_id !== userId) {
      connection.release();
      res.status(403).json({
        success: false,
        message: 'You are not authorized to update this pamphlet.',
      });
      return;
    }

    // Update pamphlet
    await connection.query(
      `UPDATE pamphlets 
       SET title = COALESCE(?, title), 
           description = COALESCE(?, description),
           image_url = COALESCE(?, image_url),
           category = COALESCE(?, category),
           location = COALESCE(?, location)
       WHERE id = ?`,
      [title, description, image_url, category, location, id],
    );

    connection.release();

    successResponse(res, 200, null, 'Pamphlet updated successfully.');
  },
);

/**
 * Delete a pamphlet
 * Requires authentication and ownership
 * @param req - Express Request with id param and authenticated user
 * @param res - Express Response
 */
export const deletePamphlet = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    // Get pamphlet first
    const connection = await pool.getConnection();
    const [pamphlets] = await connection.query<Pamphlet[]>(
      'SELECT user_id FROM pamphlets WHERE id = ?',
      [id],
    );

    if ((pamphlets as RowDataPacket[]).length === 0) {
      connection.release();
      res.status(404).json({
        success: false,
        message: 'Pamphlet not found.',
      });
      return;
    }

    const pamphlet = pamphlets[0] as RowDataPacket as Pamphlet;

    // Check ownership
    if (pamphlet.user_id !== userId) {
      connection.release();
      res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this pamphlet.',
      });
      return;
    }

    // Delete pamphlet
    await connection.query('DELETE FROM pamphlets WHERE id = ?', [id]);

    connection.release();

    const response: ApiResponse<null> = {
      success: true,
      message: 'Pamphlet deleted successfully.',
    };

    res.status(200).json(response);
  },
);
