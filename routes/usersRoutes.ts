import express from 'express';
import {
  getUserByIdHandler,
  getUsersHandler,
} from '../controllers/usersController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUsersHandler);

router.get('/:id', authMiddleware, getUserByIdHandler);

export default router;
