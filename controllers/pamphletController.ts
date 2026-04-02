import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/db.js';
import { SUCCESS } from '../constants/result.constants.js';
import {
  ForbiddenException,
  NotFoundException,
  UnAuthorizedException,
} from '../types/errors.js';
import {
  CountResult,
  PaginatedApiResponse,
  Pamphlet,
  PamphletPayload,
  PamphletWithAuthor,
} from '../types/index.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { errorSuccessMessage, successResponse } from '../utils/helpers.js';

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
        p.thumbnail_image, 
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
      data: pamphlets,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    successResponse<PaginatedApiResponse<PamphletWithAuthor>>(
      res,
      200,
      response,
      'Pamphlets retrieved successfully.',
    );
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

    if (!pamphletResult.length) {
      connection.release();

      throw new NotFoundException();
    }

    const pamphlet = pamphletResult[0];

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
    const response = {
      ...pamphlet,
      images: imagesResult.map((img) => img.image_url),
      contact,
      store_location,
    };

    successResponse(res, 200, response, 'Pamphlet retrieved successfully.');
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
      short_description,
      thumbnail_image,
      category,
      location,
      url_key,
    }: PamphletPayload = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO pamphlets (title, short_description, thumbnail_image, category, location, user_id, url_key) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        short_description,
        thumbnail_image || null,
        category,
        location,
        userId,
        url_key,
      ],
    );

    connection.release();

    errorSuccessMessage({
      res,
      status: 201,
      message: 'Pamphlet created successfully.',
      type: SUCCESS,
    });
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
      short_description,
      thumbnail_image,
      category,
      location,
    }: PamphletPayload = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new UnAuthorizedException('User  not found');
    }

    // Get pamphlet first
    const connection = await pool.getConnection();
    const [pamphlets] = await connection.query<Pamphlet[]>(
      'SELECT user_id FROM pamphlets WHERE id = ?',
      [id],
    );

    if (!pamphlets.length) {
      connection.release();

      throw new NotFoundException('Pamphlet not found');
    }

    // Check ownership
    if (pamphlets[0].user_id !== userId) {
      connection.release();

      throw new ForbiddenException(
        'You are not authorized to update this pamphlet.',
      );
    }

    // Update pamphlet
    await connection.query(
      `UPDATE pamphlets 
       SET title = COALESCE(?, title), 
           short_description = COALESCE(?, short_description),
           thumbnail_image = COALESCE(?, thumbnail_image),
           category = COALESCE(?, category),
           location = COALESCE(?, location)
       WHERE id = ?`,
      [title, short_description, thumbnail_image, category, location, id],
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
      throw new UnAuthorizedException('User not found');
    }

    // Get pamphlet first
    const connection = await pool.getConnection();
    const [pamphlets] = await connection.query<Pamphlet[]>(
      'SELECT user_id FROM pamphlets WHERE id = ?',
      [id],
    );

    if (!pamphlets.length) {
      connection.release();

      throw new NotFoundException('Pamphlet not found');
    }

    // Check ownership
    if (pamphlets[0].user_id !== userId) {
      connection.release();

      throw new ForbiddenException(
        'You are not authorized to delete this pamphlet.',
      );
    }

    // Delete pamphlet
    await connection.query('DELETE FROM pamphlets WHERE id = ?', [id]);

    connection.release();

    errorSuccessMessage({
      res,
      status: 200,
      message: 'Pamphlet deleted successfully.',
      type: SUCCESS,
    });
  },
);
