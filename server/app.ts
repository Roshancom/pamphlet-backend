import cors from 'cors';
import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import rootRouter from '../routes/rootRoutes.js';
import { NotFoundException } from '../types/errors.js';

const app = express();

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(cors());

// Routes
app.use('/api', rootRouter);

app.use((req, _, next) => {
  next(
    new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`),
  );
});

/**
 * Global error handling middleware
 */
app.use(errorHandler);

export default app;
