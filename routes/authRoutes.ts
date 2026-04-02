import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import {
  registerSchema,
  loginSchema,
} from '../validations/auth.validations.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validationMiddleware(registerSchema), register);

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login', validationMiddleware(loginSchema), login);

export default router;
