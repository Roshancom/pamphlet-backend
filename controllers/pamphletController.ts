import { Request, Response } from 'express';
import { SUCCESS } from '../constants/result.constants.js';
import {
  deletePamphlet,
  getPamphletsWithFilters,
  pamphletByUrlKey,
  postPamphlet,
  updatePamphlet,
} from '../services/pamphlts.services.js';
import { PaginatedApiResponse, Pamphlet } from '../types/index.js';
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
    const { data, limit, page, total, totalPages } =
      await getPamphletsWithFilters(req.query);

    const response: PaginatedApiResponse<Pamphlet> = {
      data,
      page,
      limit,
      total,
      totalPages,
    };

    successResponse<PaginatedApiResponse<Pamphlet>>(
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

    const result = await pamphletByUrlKey(url_key);

    successResponse(res, 200, result, 'Pamphlet retrieved successfully.');
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
    const payload = req.body;
    const userId = req.user?.id;

    await postPamphlet(payload, userId);

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
export const updatePamphletHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const payload = req.body;
    const userId = req.user?.id;

    await updatePamphlet(Number(id), payload, userId);

    successResponse(res, 200, null, 'Pamphlet updated successfully.');
  },
);

/**
 * Delete a pamphlet
 * Requires authentication and ownership
 * @param req - Express Request with id param and authenticated user
 * @param res - Express Response
 */
export const deletePamphletHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    await deletePamphlet(Number(id), userId);

    errorSuccessMessage({
      res,
      status: 200,
      message: 'Pamphlet deleted successfully.',
      type: SUCCESS,
    });
  },
);
