import express from 'express';

import {
  createPamphlet,
  deletePamphletHandler,
  getAllPamphlets,
  getPamphletByUrlKey,
  updatePamphletHandler,
} from '../controllers/pamphletController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import { pamphletSchema } from '../validations/pamphlets.validation.js';

const router = express.Router();

/**
 * GET /api/pamphlets
 * Get all pamphlets with optional filtering and pagination
 * Query params: page, limit, category, location
 * Public route
 */
router.get('/', getAllPamphlets);

/**
 * GET /api/pamphlets/:id
 * Get a specific pamphlet by ID
 * Public route
 */
router.get('/:url_key', getPamphletByUrlKey);

/**
 * POST /api/pamphlets
 * Create a new pamphlet
 * Protected route - requires authentication
 */
router.post(
  '/',
  authMiddleware,
  validationMiddleware(pamphletSchema),
  createPamphlet,
);

/**
 * PUT /api/pamphlets/:id
 * Update a pamphlet
 * Protected route - requires authentication and ownership
 */
router.put('/:id', authMiddleware, updatePamphletHandler);

/**
 * DELETE /api/pamphlets/:id
 * Delete a pamphlet
 * Protected route - requires authentication and ownership
 */
router.delete('/:id', authMiddleware, deletePamphletHandler);

export default router;
