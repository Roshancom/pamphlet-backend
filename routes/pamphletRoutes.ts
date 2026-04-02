import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getAllPamphlets,
  getPamphletByUrlKey,
  createPamphlet,
  updatePamphlet,
  deletePamphlet,
} from '../controllers/pamphletController.js';
import { validationMiddleware } from 'middleware/validationMiddleware.js';
import z from 'zod';

const pamphletSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.string().nonempty('Category is required'),
  location: z.string().min(1, 'Location is required'),
  image_url: z.string().optional(),
  url_key: z.string().nonempty('URL Key is required'),
  number: z
    .number()
    .min(2, 'Number of pamphlets must be at least 2')
    .max(10, 'Number of pamphlets must be at most 10'),
});

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
router.put('/:id', authMiddleware, updatePamphlet);

/**
 * DELETE /api/pamphlets/:id
 * Delete a pamphlet
 * Protected route - requires authentication and ownership
 */
router.delete('/:id', authMiddleware, deletePamphlet);

export default router;
