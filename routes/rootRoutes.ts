import express from 'express';

import authRoutes from './authRoutes.js';
import categoriesRoutes from './categoriesRoutes.js';
import pamphletRoutes from './pamphletRoutes.js';
import usersRoutes from './usersRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/pamphlets', pamphletRoutes);
rootRouter.use('/categories', categoriesRoutes);
rootRouter.use('/users', usersRoutes);

export default rootRouter;
