import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getAllPamphlets,
  getPamphletByUrlKey,
  createPamphlet,
  updatePamphlet,
  deletePamphlet,
} from '../controllers/pamphletController.js';

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
router.post('/', authMiddleware, createPamphlet);

/**
 * PUT /api/pamphlets/:id
 * Update a pamphlet
 * Protected route - requires authentication and ownership
 */
router.put('/:id', authMiddleware, updatePamphlet);

/**
 * DELETE /api/pamphlets/:id
 * Delete a pamphlet
 * Protected route - requires authentication and ownership
 */
router.delete('/:id', authMiddleware, deletePamphlet);

export default router;
