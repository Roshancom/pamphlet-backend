import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandlerMiddleware } from '../middleware/errorHandlerMiddleware.js';
import rootRouter from '../routes/rootRoutes.js';
import { NotFoundException } from '../types/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(cors());

// Routes
app.use('/api', rootRouter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, _, next) => {
  next(
    new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`),
  );
});

/**
 * Global error handling middleware
 */
app.use(errorHandlerMiddleware);

export default app;
