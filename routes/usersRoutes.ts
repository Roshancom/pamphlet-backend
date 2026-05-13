import express from 'express';
import {
  deleteUserByIdHandler,
  getPamphletsByuser_idHandler,
  getUserByIdHandler,
  getUsersHandler,
  updateUserByIdHandler,
} from '../controllers/usersController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUsersHandler);

router.get('/:id', authMiddleware, getUserByIdHandler);

router.put('/:id', authMiddleware, updateUserByIdHandler);

router.delete('/:id', authMiddleware, deleteUserByIdHandler);

router.get('/pamphlets/:user_id', authMiddleware, getPamphletsByuser_idHandler);

export default router;
