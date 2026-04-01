import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../routes/authRoutes.js';
import pamphletRoutes from '../routes/pamphletRoutes.js';
import { errorHandler } from '../middleware/errorHandler.js';
import categoriesRoutes from '../routes/categoriesRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pamphlets', pamphletRoutes);
app.use('/api/categories', categoriesRoutes);

/**
 * Base route - API documentation
 */
app.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Pamphlet Marketing Platform API',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login'],
      pamphlets: [
        'GET /api/pamphlets',
        'GET /api/pamphlets/:id',
        'POST /api/pamphlets',
        'PUT /api/pamphlets/:id',
        'DELETE /api/pamphlets/:id',
      ],
    },
  });
});

/**
 * 404 handler
 */
app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

/**
 * Global error handling middleware
 */
app.use(errorHandler);

export default app;
