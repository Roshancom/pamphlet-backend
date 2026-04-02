import express from 'express';
import { validationMiddleware } from 'middleware/validationMiddleware.js';
import z from 'zod';
import {
  createPamphlet,
  deletePamphlet,
  getAllPamphlets,
  getPamphletByUrlKey,
  updatePamphlet,
} from '../controllers/pamphletController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const pamphletSchema = z.object({
  title: z.string().nonempty('Title is required'),
  short_description: z
    .string()
    .min(5, 'Short description is required')
    .optional(),
  category: z.string().nonempty('Category is required'),
  location: z.string().nonempty('Location is required'),
  thumbnail_image: z.string().optional(),
  url_key: z.string().nonempty('URL Key is required'),
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
